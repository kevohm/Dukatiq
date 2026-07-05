import { createFileRoute } from "@tanstack/react-router";
import { WorkOrdersPage } from "../../pages/WorkOrderPages";


export const Route = createFileRoute("/work-orders/")({
  component: ()=><WorkOrdersPage/>,
});

