"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";

type ActionResult = { success: true } | { success: false; error: string };

function readAddressForm(formData: FormData) {
  return {
    label: (formData.get("label") as string) || "",
    firstName: (formData.get("firstName") as string) || "",
    lastName: (formData.get("lastName") as string) || "",
    company: (formData.get("company") as string) || "",
    line1: (formData.get("line1") as string) || "",
    line2: (formData.get("line2") as string) || "",
    city: (formData.get("city") as string) || "",
    state: (formData.get("state") as string) || "",
    postalCode: (formData.get("postalCode") as string) || "",
    country: (formData.get("country") as string) || "US",
    phone: (formData.get("phone") as string) || "",
    isDefault: formData.get("isDefault") === "on",
  };
}

export async function addAddress(formData: FormData): Promise<ActionResult> {
  try {
    const user = await getPayloadUser();
    if (!user) return { success: false, error: "You must be signed in." };

    const data = readAddressForm(formData);
    if (
      !data.firstName ||
      !data.lastName ||
      !data.line1 ||
      !data.city ||
      !data.state ||
      !data.postalCode ||
      !data.phone
    ) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const payload = await getPayload({ config });

    if (data.isDefault) {
      const existing = await payload.find({
        collection: "addresses",
        where: { user: { equals: user.id } },
        overrideAccess: true,
      });
      for (const addr of existing.docs as any[]) {
        if (addr.isDefaultShipping) {
          await payload.update({
            collection: "addresses",
            id: addr.id,
            data: { isDefaultShipping: false, isDefaultBilling: false },
            overrideAccess: true,
          });
        }
      }
    }

    await payload.create({
      collection: "addresses",
      data: {
        user: user.id,
        label: data.label || data.line1,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || undefined,
        line1: data.line1,
        line2: data.line2 || undefined,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefaultShipping: data.isDefault,
        isDefaultBilling: data.isDefault,
      },
      overrideAccess: true,
    });

    revalidatePath("/account/addresses");
    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong. Please try again.",
    };
  }
}

export async function updateAddress(
  addressId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await getPayloadUser();
    if (!user) return { success: false, error: "You must be signed in." };

    const data = readAddressForm(formData);
    if (
      !data.firstName ||
      !data.lastName ||
      !data.line1 ||
      !data.city ||
      !data.state ||
      !data.postalCode ||
      !data.phone
    ) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const payload = await getPayload({ config });

    const address = await payload.findByID({
      collection: "addresses",
      id: addressId,
      overrideAccess: true,
    });
    const ownerId =
      typeof (address as any).user === "object"
        ? (address as any).user?.id
        : (address as any).user;
    if (String(ownerId) !== String(user.id)) {
      return { success: false, error: "You do not own this address." };
    }

    if (data.isDefault) {
      const existing = await payload.find({
        collection: "addresses",
        where: { user: { equals: user.id } },
        overrideAccess: true,
      });
      for (const addr of existing.docs as any[]) {
        if (addr.isDefaultShipping && String(addr.id) !== String(addressId)) {
          await payload.update({
            collection: "addresses",
            id: addr.id,
            data: { isDefaultShipping: false, isDefaultBilling: false },
            overrideAccess: true,
          });
        }
      }
    }

    await payload.update({
      collection: "addresses",
      id: addressId,
      data: {
        label: data.label || data.line1,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || undefined,
        line1: data.line1,
        line2: data.line2 || undefined,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefaultShipping: data.isDefault,
        isDefaultBilling: data.isDefault,
      },
      overrideAccess: true,
    });

    revalidatePath("/account/addresses");
    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong. Please try again.",
    };
  }
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
  try {
    const user = await getPayloadUser();
    if (!user) return { success: false, error: "You must be signed in." };

    const payload = await getPayload({ config });

    const address = await payload.findByID({
      collection: "addresses",
      id: addressId,
      overrideAccess: true,
    });
    const ownerId =
      typeof (address as any).user === "object"
        ? (address as any).user?.id
        : (address as any).user;
    if (String(ownerId) !== String(user.id)) {
      return { success: false, error: "You do not own this address." };
    }

    await payload.delete({
      collection: "addresses",
      id: addressId,
      overrideAccess: true,
    });

    revalidatePath("/account/addresses");
    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong. Please try again.",
    };
  }
}
