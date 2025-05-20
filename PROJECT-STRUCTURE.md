# T3 Stack Project Structure

After migration, your project structure would look like this:

```
WARMAPPER-T3/
├── .eslintrc.cjs         # ESLint configuration
├── .gitignore
├── components.json       # shadcn/ui configuration
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration for Tailwind
├── public/               # Public assets
│   ├── data/             # WiFi data files
│   │   ├── sample-data.txt
│   │   └── wardrive_1.log
│   └── favicon.ico
├── src/                  # Source code
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout with ThemeProvider and WiFiProvider
│   │   └── page.tsx      # Main dashboard page
│   ├── components/       # React components
│   │   ├── cards.tsx     # Custom card components
│   │   ├── dashboard/    # Dashboard components
│   │   │   ├── dashboard.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── header.tsx
│   │   ├── map/          # Map components
│   │   │   └── map-view.tsx
│   │   ├── theme-provider.tsx
│   │   └── ui/           # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── table.tsx
│   │       └── tabs.tsx
│   ├── contexts/         # React contexts
│   │   └── wifi-context.tsx
│   ├── lib/              # Utility functions
│   │   ├── utils.ts      # General utilities
│   │   └── wifi-utils.ts # WiFi data processing utilities
│   ├── styles/           # CSS styles
│   │   └── globals.css   # Global CSS including Tailwind directives
│   └── types/            # TypeScript types
│       └── index.ts      # Type definitions
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

This structure follows the T3 stack conventions while maintaining your existing code organization.