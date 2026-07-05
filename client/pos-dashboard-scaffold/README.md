# POS Dashboard Scaffold

Drop the `src/` contents into your existing Vite + TanStack Router + Tailwind v4 project (merge, don't overwrite your existing `main.tsx` / router setup).

## 1. Install dependencies

```bash
npm install clsx tailwind-merge lucide-react
```

`clsx` + `tailwind-merge` power the `cn()` helper. `lucide-react` provides all icons used in the sidebar, badges, and buttons.

## 2. Wire up globals.css

Make sure your entry CSS file imports the theme tokens:

```css
/* src/styles/globals.css already has @import "tailwindcss" + @theme tokens */
```

Import it once in your app entry (`main.tsx`):

```ts
import "./styles/globals.css";
```

If you already have a globals.css with your own `@theme` block, merge the tokens from this file into yours instead of overwriting.

## 3. Routes

This scaffold assumes TanStack Router's file-based routing plugin is already configured (route tree auto-generated from `src/routes/**`). If you're on manual route trees instead, adapt `__root.tsx`, `index.tsx`, and `work-orders/index.tsx` into your existing route definitions — the components themselves (`AppShell`, `Sidebar`, `Topbar`, `DataTable`, etc.) work the same either way.

## 4. What's here

```
components/
  layout/     Sidebar, Topbar, AppShell — app chrome, reused everywhere
  ui/         Button, Badge, Avatar — generic design-system primitives
  data-table/ Generic DataTable + pagination, domain-agnostic

features/
  work-orders/
    types.ts        WorkOrder type
    mock-data.ts     Fake rows — swap for a real API/query hook later
    columns.tsx      Column config consumed by DataTable
    components/      PriorityBadge, AssigneeCell, FilterBar (work-order specific)

routes/
  __root.tsx              Wraps every page in AppShell
  index.tsx               Redirects "/" -> "/work-orders"
  work-orders/index.tsx   The actual page, composes everything above
```

## 5. Adding your next module (e.g. Assets)

1. Add a nav entry in `Sidebar.tsx`'s `secondaryNav` array (already has one for Assets).
2. Create `src/features/assets/{types,mock-data,columns}.ts`.
3. Create `src/routes/assets/index.tsx` — copy `work-orders/index.tsx` and swap the imports.
4. Reuse `DataTable`, `FilterBar` pattern, `Button`, `Badge` as-is.

No changes needed to `AppShell`, `Sidebar` (besides the one nav entry), or `DataTable`.

## 6. Next steps to make it real

- Replace `mock-data.ts` with a `api.ts` (fetch calls) + a `useWorkOrders()` hook using TanStack Query.
- Add real pagination logic (currently `onPrev`/`onNext` are stubbed).
- Add Board and Calendar view components that consume the same `mockWorkOrders` / future API data — the view switcher in the screenshot toggles between renderers of the same dataset.
