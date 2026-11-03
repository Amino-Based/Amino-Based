import React from "react";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { OrdersClient, type OrderListItem } from "@/components/account/OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getPayloadUser();
  if (!user) redirect("/login");

  const payload = await getPayload({ config });

  const { docs: orders } = await payload.find({
    collection: "orders",
    where: {
      or: [
        { owner: { equals: user.id } },
        { guestEmail: { equals: user.email } },
      ],
    },
    sort: "-createdAt",
    limit: 100,
    overrideAccess: true,
  });

  const orderItems: OrderListItem[] = (orders as any[]).map((order) => ({
    id: String(order.orderNumber || order.id),
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown date",
    status: order.status || "pending",
    total: Number(order.total || 0),
    itemCount: Array.isArray(order.items)
      ? order.items.reduce(
          (acc: number, item: any) => acc + (item.quantity || 1),
          0
        )
      : 0,
  }));

  return <OrdersClient orders={orderItems} />;
}
