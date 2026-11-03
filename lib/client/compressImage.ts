/**
 * Shrinks a photo in the browser before it's uploaded. Phone photos are often 4–12 MB, but a
 * request body larger than ~4.5 MB is rejected by the host (Vercel) — and ID photos only need to
 * stay readable. Re-encodes as JPEG, longest side ≤ maxDimension, and lowers quality until it fits.
 *
 * If the browser can't decode the file (e.g. HEIC outside Safari) the original is returned
 * unchanged, so the caller must still check the size.
 */
export async function compressImage(
  file: File,
  { maxDimension = 2000, maxBytes = 2.5 * 1024 * 1024 }: { maxDimension?: number; maxBytes?: number } = {}
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // Small enough already — don't degrade it.
  if (file.size <= maxBytes && file.type !== "image/heic") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  for (const quality of [0.85, 0.75, 0.65, 0.5]) {
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= maxBytes) {
      return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
    }
  }
  return file;
}
