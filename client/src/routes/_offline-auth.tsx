import { createFileRoute, Outlet } from '@tanstack/react-router'


export const Route = createFileRoute('/_offline-auth')({
  component: RouteComponent,
})

function RouteComponent() {

   
  return <Outlet/>
}
