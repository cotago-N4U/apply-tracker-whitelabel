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

## Résumé intake preview

- Source commit: `e3d5b62d46a2cb2666afa820c8356a4daa8f44ce`
- Ready preview deployment: `dpl_4tPZtVt5qGC13RwXSE9hQydhSSSK`
- Preview URL: https://apply-tracker-whitelabel-ogy544b0j-n4u.vercel.app/
- Open Use your own résumé in the walkthrough or expand Upload or paste your résumé in the Résumé section. PDF with selectable text, DOCX and TXT are extracted on the device using version-locked, same-origin scripts. Users can paste, correct, confirm, or clear the text. Personal inputs live in page memory and clear on reload.
- Local desktop and mobile Chromium accepted pasted text and all three file formats, preserved existing text on a blank PDF import error, loaded no external resources, issued no submission requests and retained the sample workflow. Signed-in walkthrough on the hosted URL remains pending.
- This preview does not score personal text against the sample job. Real job entry and comparison are the next integration milestone.

## Personal application workspace

- Source commit: `8c97fb46e414186d5d68c917902b8b87e568eae1`
- Ready Vercel preview deployment: `dpl_CogbyaKgyrMS29N3oW7AJoL3weMt`
- Preview URL: https://apply-tracker-whitelabel-2rkukzb2u-n4u.vercel.app/
- Use your own résumé opens a personal workspace. Confirming shows the user's extracted or pasted text. Enter a job title and optional company, choose Use this job, then attach and download the confirmed résumé. Unchanged imports retain the exact original file bytes; edited or pasted content is attached as a TXT file. The previous attachment remains available while editing until the user explicitly replaces it.
- Local desktop and mobile Chromium verified workspace isolation, original PDF byte-for-byte, edited TXT attachment, file and job clearance on reload, no transfer of personal content, and the sample flow. Signed-in hosted walkthrough remains pending.
- See the latest comparison build below. Revision into a new formatted PDF is pending. All personal input and attachments are scoped to this tab session.

## Job-posting comparison preview

- Source commit: `d41ce7d4fde99981e46c640bf011c894aef874d2`
- Ready Vercel preview deployment: `dpl_FxdH5nRvCdMMJCRQ2zq8H9TKwC4i`
- Preview URL: https://apply-tracker-whitelabel-e43f80ads-n4u.vercel.app/
- In Your application, confirm a résumé, paste the job description under Your job, and choose Use this job. Verify or edit the extracted requirements before comparing. The browser finds related résumé excerpts by word overlap and labels gaps as missing clear text. It does not establish qualification or provide an ATS score.
- Local Chromium at desktop and emulated mobile widths passed suggestions, excerpts, missing evidence, manual requirements, stale-result invalidation, attachment, and reload clearance. The test checked that no input was sent or persisted. Signed-in hosted walkthrough remains pending.

## Requirement filtering and evidence cues

- Source commit: `948e3b9f72306296b192f9c6e5e90d8ca6c5ed9b`
- Ready Vercel preview deployment: `dpl_jutj25Au1c1E3Pmry2Wsm5LWg9Fy`
- Preview URL: https://apply-tracker-whitelabel-rfbuas0xl-n4u.vercel.app/
- The browser now excludes employer boilerplate, accommodations, and salary footers. It checks common descriptions of related work as well as shared words, treats alternatives independently, and flags experience durations for manual review. The summary counts possible excerpts.
- The Amazon excerpt supplied by Cota retains 10 qualifications. A synthetic director résumé yielded 9 possible excerpts, one unresolved requirement, and no excerpts on an unrelated résumé. Regression: `node --test tests/resume-comparison.test.mjs`. Desktop and emulated mobile Chromium also verified the flow. The test did not use Cota’s résumé.

## Comparison v3

- Source commit: `5a35c6ac17d6390c94863510c94fa1cc7fa5299d`
- Ready Vercel preview deployment: `dpl_C6aNbgwvZ2eSkk32m2dYjCMD7eyV`
- Preview URL: https://apply-tracker-whitelabel-52spsj4zd-n4u.vercel.app/
- The comparison shows a visible version and counts required and preferred items before running. Heading normalization supports copied Markdown headings. Longer PDF text lines are compared in overlapping excerpts. Duration evidence recognizes work-history date ranges with month names and still requires user verification.
- Regression tests cover the Amazon posting's layout, two required and eight preferred qualifications, and creative leadership/date evidence in long synthetic résumé text. Desktop and mobile browser smoke tests also pass. The actual user PDF and signed-in hosted walkthrough remain unverified.

## Preview build 4

- Source commit: `92e1335c1ade9d54dfc7dc1185e105e437d4d998`
- Ready Vercel preview deployment: `dpl_DpoXVAr2vsu3ZhXpyhFqPoDZA3gz`
- Preview URL: https://apply-tracker-whitelabel-jf0qgdjft-n4u.vercel.app/
- Cota confirmed Comparison v3 returned 10 requirements and 8 possible excerpts. Executive influence in a skills list was incorrectly surfaced for creative executive tenure and mentoring. The matcher now prefers dated creative leadership titles and requires evidence of coaching, mentoring or staff development for the mentoring example. A degree excerpt is labeled as the degree alternative.
- The regression covers the misleading skills list, a dated title, a bachelor’s degree, and explicit staff training. Local desktop and mobile browser tests passed. The revised build did not use Cota’s résumé and needs signed-in verification with his PDF.

## Next decision

Have Cota assess the comparison using a real role. Collect examples of useful excerpts, irrelevant matches and qualifications missed through different wording before choosing revision assistance or a richer comparison method. Keep package status distinct from application submission.
