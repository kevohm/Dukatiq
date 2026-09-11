# Dukatiq client
# Structure

src/
├── app/                    # App setup (providers, router, config)
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/         # global wrappers (query, theme, auth, etc.)
│
├── routes/                # Pages / route entry points
│   ├── __root.tsx         # layout (navbar/sidebar)
│   ├── index.tsx          # home / redirect
│   └── <feature>/         # feature-based routing
│       ├── index.tsx
│       ├── $id.tsx
│       └── -components/   # route-specific components only
│
├── features/              # 🔥 CORE pattern (domain-based)
│   └── <feature-name>/
│       ├── api.ts         # server/offline calls
│       ├── types.ts       # types/interfaces
│       ├── hooks.ts       # business logic hooks
│       ├── utils.ts       # feature-specific helpers
│       └── components/    # feature UI (NOT global)
│
├── components/            # reusable UI (design system)
│   ├── ui/               # buttons, inputs, badges
│   ├── layout/           # navbar, sidebar, wrappers
│   └── shared/           # cross-feature components
│
├── lib/                  # infrastructure / core utilities
│   ├── api-client.ts     # HTTP client
│   ├── config.ts         # env/config
│   ├── constants.ts
│   ├── utils.ts          # generic helpers
│   └── cn.ts             # className helper
│
├── hooks/                # global reusable hooks
│   ├── useDebounce.ts
│   ├── useToggle.ts
│   └── useSomething.ts
│
├── store/ (optional)     # global state (Zustand/Redux)
│   └── index.ts
│
├── types/                # global shared types
│   └── index.ts
│
├── services/ (optional)  # external integrations (if not feature-specific)
│   └── <service>.ts
│
└── styles/
    └── globals.css