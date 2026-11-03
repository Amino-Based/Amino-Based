import React from "react";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import {
  AddressesClient,
  type AddressItem,
} from "@/components/account/AddressesClient";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = await getPayloadUser();
  if (!user) redirect("/login");

  const payload = await getPayload({ config });

  const { docs: addresses } = await payload.find({
    collection: "addresses",
    where: { user: { equals: user.id } },
    sort: "-updatedAt",
    overrideAccess: true,
  });

  const addressItems: AddressItem[] = (addresses as any[]).map((addr) => ({
    id: String(addr.id),
    label: addr.label || "",
    firstName: addr.firstName,
    lastName: addr.lastName,
    company: addr.company || "",
    line1: addr.line1,
    line2: addr.line2 || "",
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country || "US",
    phone: addr.phone,
    isDefault: !!addr.isDefaultShipping,
  }));

  return <AddressesClient addresses={addressItems} />;
}
