# Partners Program Refactor Log

Date: 2026-03-24

Scope:
- `src/pages/partners-program.astro`
- `src/components/partners/*`
- shared helpers in `src/styles/new-global.css`

Constraints:
- `src/pages/refer.astro` is out of scope for this pass.
- `global_lend.css` remains connected through `MainLayout`.
- `new-global.css` is additionally connected only for `partners-program`.

Rollback notes:
- Keep changes isolated to the files above.
- Use this log together with `git diff -- src/pages/partners-program.astro src/components/partners src/styles/new-global.css`.
- Current workspace already contains unrelated changes:
  - deleted: `src/pages/_partners-program.txt`
  - untracked: `src/pages/partners-program.astro`

Completed checkpoints:
1. Connected `new-global.css` to `partners-program`.
2. Added shared `partner-*` helper classes to `new-global.css`.
3. Replaced block headings with `H2Zag` in the main section components.
4. Removed alternating section backgrounds from the refactored blocks and aligned card/motion styles to the new global tokens.
5. Kept the calculator logic intact while only refactoring its header and token usage.
6. Removed heading chips from the `partners-program` blocks and moved vertical spacing control to the shared page gap.
7. Added a final `TgChecker` section to the end of `partners-program` using the existing checker logic from the `refer` flow.

Touched files:
- `src/styles/new-global.css`
- `src/components/partners/ReferHero.astro`
- `src/components/partners/ReferStats.astro`
- `src/components/partners/ReferBenefits.astro`
- `src/components/partners/ReferHowItWorks.astro`
- `src/components/partners/ReferPlacement.astro`
- `src/components/partners/ReferRules.astro`
- `src/components/partners/ReferCalculator.astro`
- `src/components/partners/ReferFaq.astro`
- `src/components/partners/ReferForm.astro`
- `src/components/partners/ReferTelegramChecker.astro`
- `src/pages/partners-program.astro`

Notes:
- `refer.astro` was not touched.
- `MainLayout` was not migrated; `partners-program` now relies on both globals for this phase.
- The calculator still keeps a larger local style block; this was intentional to reduce regression risk in the interactive logic.
- The Telegram checker itself is reused from `src/components/slots/TgChecker.astro`; only the surrounding section is new in `partners-program`.
- Console output showed mixed encoding while inspecting some files, so the final verification source of truth should be `git diff`, not raw PowerShell output.
- A fresh sandboxed build still cannot be relied on in this environment because `astro sync` fails with `spawn EPERM`.

Suggested rollback points:
- Full rollback of this pass: `git checkout -- src/styles/new-global.css src/components/partners`
- Partial rollback by block: revert only the specific component files listed above.
Verification:
- 
pm run build completed successfully on 2026-03-24 after rerunning outside the sandbox due an EPERM unlink error in 
ode_modules/.vite inside the sandbox.
- Route verified in build output: /partners-program/index.html.
