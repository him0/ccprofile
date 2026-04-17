Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Changesets

When you make changes that affect the published package (features, fixes, breaking changes), add a changeset:

```bash
bun run changeset
```

- Choose the bump type: `patch` for fixes, `minor` for features, `major` for breaking changes.
- Write a short, user-facing summary of the change.
- Commit the generated `.changeset/*.md` file alongside your code changes.
- Skip changesets only for non-shipping changes (docs-only edits, internal refactors with no behavior change, CI tweaks, test-only changes).
