# T3 Stack Setup Guide for WARMAPPER

## Initial Setup

1. Open a terminal and navigate to where you want to create the project:

```bash
cd /Users/jasonbrashear/code
```

2. Run the create-t3-app command:

```bash
npm create t3-app@latest
```

3. During the interactive setup, answer the prompts as follows:

- **What will your project be called?** `WARMAPPER-T3`
- **Will you be using TypeScript?** `Yes`
- **Will you be using ESLint?** `Yes`
- **Will you be using Tailwind CSS?** `Yes`
- **Will you be using tRPC?** `No` (unless you plan to add an API layer)
- **Will you be using NextAuth.js?** `No` (unless you plan to add authentication)
- **Will you be using Prisma?** `No` (unless you plan to add a database)

4. Once the project is created, navigate to it:

```bash
cd WARMAPPER-T3
```

5. Install shadcn/ui:

```bash
npx shadcn@latest init
```

6. During the shadcn/ui setup, answer the prompts as follows:

- **Which style would you like to use?** `Default`
- **Which color would you like to use as base color?** `Slate`
- **Where is your global CSS file?** `src/styles/globals.css` (this is the T3 default)
- **Would you like to use CSS variables for colors?** `Yes`
- **Where is your tailwind.config.js located?** `tailwind.config.js`
- **Configure the import alias for components?** `@/components`
- **Configure the import alias for utils?** `@/lib/utils`
- **Are you using React Server Components?** `Yes`
- **Write configuration to components.json?** `Yes`

7. Install the required dependencies:

```bash
npm install recharts lodash next-themes @radix-ui/react-slot @radix-ui/react-tabs class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
npm install @types/lodash --save-dev
```

8. After setup, install all the shadcn/ui components you need:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add card
```