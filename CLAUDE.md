# pbov-frontend-components — Notes for Claude

Shared React component library (`@ovi1kanobe/pbov`) for the court's PocketBase
apps (ccfw, cccr, ccja, ccme). Consumed as a git dependency; the built `dist/`
is committed so apps install straight from GitHub.

## Component conventions

- **Components are presentational — they never make network requests.** No
  `pb.send`, no `pb.collection`, no fetch inside a component or a hook shipped
  from this package. Anything that needs data takes it as props; anything that
  needs to *do* something takes a function prop (e.g.
  `fetchStatus: () => Promise<Status>`, `saveConfig: (c) => Promise<Config>`).
  The consuming app owns endpoints, auth, and the PocketBase client. See
  `ParentLinkSection` / `DiagnosticsSection` for the pattern.
- A `pb` prop is acceptable only for non-request uses like building file URLs
  (`pb.files.getURL`), as in the avatar widgets.
- Components that poll via a function prop must keep the latest fn in a ref
  (see `DiagnosticsSection`) so callers can pass inline arrows without the
  changing identity resetting the interval every render.
- Export the request/response types next to the component so apps can type
  their `pb.send` calls.
- Generic, reusable UI lives here; app-specific composition stays in the app,
  colocated under the page that uses it (`_components/`).
- User-facing actions must give feedback: toast on success and failure, and
  disable buttons while in flight. Show dirty state on forms with a Save.

## Publishing a change (apps consume this via git)

1. `bun run build` in this package.
2. `git status` and check for weird build artifacts — especially macOS
   duplicate files like `foo 2.js` in `dist/`. These are iCloud Drive conflict
   copies (the repo lives under ~/Documents, which iCloud syncs) and can appear
   at any moment, including between a clean check and the commit. Check `git
   status` output in full immediately before committing; delete any and never
   commit them: `find . -path ./node_modules -prune -o \( -name "* 2.*" -o -name "* 2" \) -exec rm -rf {} \;`
3. Commit `src/` + `dist/` together and push to main.
4. In each consuming app's `frontend/`: `bun pm cache rm` first — bun's cache
   likes to keep serving old versions of git deps — then
   `bun update @ovi1kanobe/pbov` (ccme aliases it as plain `pbov`).
5. `bun run build` in the app to confirm.

## Bun basics

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.
