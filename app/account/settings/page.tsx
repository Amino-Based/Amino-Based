import React from "react";
import { redirect } from "next/navigation";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { SettingsClient } from "@/components/account/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getPayloadUser();
  if (!user) redirect("/login");

  const userData = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email,
    phone: user.phone || "",
    acceptsMarketing: user.acceptsMarketing ?? false,
    orderSmsUpdates: user.orderSmsUpdates ?? false,
    authProvider: user.authProvider || "credentials",
  };

  return <SettingsClient user={userData} />;
}
