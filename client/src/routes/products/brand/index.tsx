import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/products/brand/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <p>Edit </p>
}
