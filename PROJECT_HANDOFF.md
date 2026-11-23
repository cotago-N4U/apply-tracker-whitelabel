# COTAFORM Apply · Package preview

The commercial workflow demo is on branch `cotaform-apply-package-preview` in `cotago-N4U/apply-tracker-whitelabel`. It uses one fictional posting and one fictional career profile. The page generates a résumé from approved sample evidence, evaluates match and basic PDF readability, and retains the exact PDF bytes and version history in browser storage.

Use the recovered `cotago-N4U/apply-tracker` main at `cf1f23175671b5d8e286a95211b7b875218ee99c` as the baseline for eventual tracker integration. This standalone workflow demo is on the dedicated white-label project so it can be evaluated independently. The preview has no model API, external service calls, Supabase account, or customer data. The personal tracker production deployment `dpl_E8SzHwVD3eR7jSGWPHY4v5qKZCSk` is separate.

## Verified guided preview build

- Source commit: `4c66e00fc0f84b46a2a6f2a3e83f0a9a36ee1ee5`
- Vercel project: `n4u/apply-tracker-whitelabel`, `prj_5SlT77Iv6QwgX6qxw3BXwTW33gkf`
- Ready preview deployment: `dpl_CqKbEWA8YnYnVgN8kTEyMdqz6ECe`
- Preview URL: https://apply-tracker-whitelabel-fv3n1rtjs-n4u.vercel.app/
- Desktop Chromium at 1440px and mobile touch emulation at 390px passed the initial action, draft generation, evidence approval, match recalculation, attachment, independent PDF text extraction, and version selection after reload. Signed-in hosted UI still needs a smoke check.
- The revised walkthrough begins with Save sample job and offers one next action per stage. The fictional budget evidence is disclosed before the user approves it. Both résumé versions remain available to compare. There are no database migrations, production credentials, or DNS changes.

## Next decision

Ask Cota to assess whether the guide makes the next action, the score change, and the attachment clear. The first real-data test should pair a user's own résumé with a user-added job. Integrate those entry points and their results with the recovered tracker's saved opportunity and package records in an isolated commercial backend. Keep package status distinct from application submission.
