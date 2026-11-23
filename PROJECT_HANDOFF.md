# COTAFORM Apply · Package preview

The commercial workflow demo is on branch `cotaform-apply-package-preview` in `cotago-N4U/apply-tracker-whitelabel`. It uses one fictional posting and one fictional career profile. The page generates a résumé from approved sample evidence, evaluates match and basic PDF readability, and retains the exact PDF bytes and version history in browser storage.

Use the recovered `cotago-N4U/apply-tracker` main at `cf1f23175671b5d8e286a95211b7b875218ee99c` as the baseline for eventual tracker integration. This standalone workflow demo is on the dedicated white-label project so it can be evaluated independently. The preview has no model API, external service calls, Supabase account, or customer data. The personal tracker production deployment `dpl_E8SzHwVD3eR7jSGWPHY4v5qKZCSk` is separate.

## Verified preview build

- Source commit: `09db9e8c6fad992e67b88f36206181771ee8de83`
- Vercel project: `n4u/apply-tracker-whitelabel`, `prj_5SlT77Iv6QwgX6qxw3BXwTW33gkf`
- Ready preview deployment: `dpl_AjKPVxYWYEqfE7HFWwGbykq45SpY`
- Preview URL: https://apply-tracker-whitelabel-pzxqr64gh-n4u.vercel.app/
- Anonymous request redirected to Vercel sign-in. The source file at the commit matched the tested local file.
- The DOM smoke test exercised saving, generating, score and evidence gap, PDF attachment and download, and selecting the attached version after reload. Poppler independently extracted the generated PDF and verified content order.
- The exact source also passed local Chromium workflows at 1440px desktop and 390px emulated mobile with touch. A signed-in smoke check on the hosted URL is pending. There are no database migrations, production credentials, or DNS changes in this preview. Reusing the verified deployment URL gives the exact build above.

## Next decision

Review the workflow with Cota and capture friction from Save sample job through attaching and downloading the PDF. After that, integrate with the recovered tracker's saved opportunity and package records in an isolated commercial backend. Add customer-specific evidence and posting snapshots before enabling live generation. Keep package status distinct from application submission.
