import { getServerSession } from "next-auth";
import { getPayload } from "payload";
import config from "@payload-config";
import type { User } from "@/payload-types";
import { cache } from "react";
import { authOptions } from "@/lib/auth/authOptions";

export const getPayloadUser = cache(async (): Promise<User | null> => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const payload = await getPayload({ config });

  try {
    const parsedId = isNaN(Number(session.user.id)) ? session.user.id : Number(session.user.id);
    const user = await payload.findByID({
      collection: "users",
      id: parsedId,
      overrideAccess: true,
    });
    return (user as User) ?? null;
  } catch {
    return null;
  }
});
