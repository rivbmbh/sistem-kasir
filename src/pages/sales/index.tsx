import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { OrderCard } from "@/components/OrderCard";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { useState } from "react";
import { api } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { OrderStatus } from "@prisma/client";

const SalesPage: NextPageWithLayout = () => {
  const apiUtils = api.useUtils();

  const [filterOrder, setFilterOrder] = useState<OrderStatus | "ALL">("ALL");
  const { data: orders } = api.order.getOrders.useQuery({
    status: filterOrder,
  });

  const {
    mutate: finishOrder,
    isPending: finishOrderIsPending,
    variables: finishOrderVariables,
  } = api.order.finishOrder.useMutation({
    onSuccess: async () => {
      await apiUtils.order.getOrders.invalidate();
      alert("Finished order");
    },
  });

  const handleFinishOrder = (orderId: string) => {
    finishOrder({
      orderId,
    });
  };

  const handleFilterOrderChange = (value: OrderStatus | "ALL") => {
    setFilterOrder(value);
  };

  return (
    <>
      <DashboardHeader>
        <DashboardTitle>Sales Dashboard</DashboardTitle>
        <DashboardDescription>
          Track your sales performance and view analytics.
        </DashboardDescription>
      </DashboardHeader>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Ongoing Orders</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Completed Orders</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex justify-between">
          <h3 className="mb-4 text-lg font-medium">Orders</h3>

          <Select defaultValue="ALL" onValueChange={handleFilterOrderChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent align="end">
              <SelectItem value="ALL">ALL</SelectItem>
              {Object.keys(OrderStatus).map((orderStatus) => {
                return (
                  <SelectItem key={orderStatus} value={orderStatus}>
                    {/* @ts-expect-error will fix type later */}
                    {OrderStatus[orderStatus]}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders?.map((order) => (
            <OrderCard
              key={order.id}
              onFinishOrder={handleFinishOrder}
              id={order.id}
              status={order.status}
              totalAmount={order.grandTotal}
              totalItems={order._count.orderItems}
              isFinishingOrder={
                finishOrderIsPending &&
                order.id === finishOrderVariables.orderId
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

SalesPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SalesPage;
