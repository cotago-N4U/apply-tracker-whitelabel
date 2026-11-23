import assert from "node:assert/strict";
import { compareResume, readRequirements, suggestRequirements } from "../resume-comparison.mjs";

const posting = `Basic Qualifications
- 10+ years of creative executive experience
- Bachelor's degree, or 4+ years of professional experience

Preferred Qualifications
- Experience owning creative input, development and execution from concept to completion
- Experience working in a fast-paced work environment
- Can work proactively and independently, meet deadlines, and deliver on projects and tasks
- Experience mentoring, coaching, and influencing colleagues, collaborators, and stakeholders
- Experience with a world-class advertising agency or internal corporate agency.
- Proven track record of taking ownership and driving results on creative projects, and history of establishing effective creative development processes.
- Relentless desire for innovation, balanced with business and user interaction priorities.
- Exceptional communication, collaboration and presentation skills.

Amazon is an equal opportunity employer and does not discriminate on the basis of protected veteran status, disability, or other legally protected status.
Our inclusive culture empowers Amazonians to deliver the best results for our customers. If you have a disability and need a workplace accommodation or adjustment during the application and hiring process, including support for the interview or onboarding process, please visit https://amazon.jobs/content/en/how-we-hire/accommodations for more information. If the country/region you’re applying in isn’t listed, please contact your Recruiting Partner.
USA, CA, Santa Monica - 167,700.00 - 226,900.00 USD annually`;
const requirements = readRequirements(suggestRequirements(posting));
assert.equal(requirements.length, 10);
assert.equal(requirements.filter(row => row.category === "required").length, 2);
assert.equal(requirements.filter(row => row.category === "preferred").length, 8);
const copiedPage = "# Creative Director, Amazon XCM\n\n## Description\nA creative leadership role.\n" +
  "Key job responsibilities\n- Deep understanding of digital and new media.\n" +
  posting.replace("Basic Qualifications", "## Basic Qualifications").replace("Preferred Qualifications", "**Preferred Qualifications**") +
  "\n## Job details\nSanta Monica\nMarketing";
assert.deepEqual(readRequirements(suggestRequirements(copiedPage)), requirements);
assert.equal(readRequirements("Preferred: Experience reviewing requests for reasonable accommodation").length, 1);
assert.equal(readRequirements("Required: Managed budgets of $500,000 to $1,000,000").length, 1);
assert.equal(readRequirements("Preferred: USA, CA, Santa Monica - 167,700.00 - 226,900.00 USD annually").length, 0);
assert.equal(readRequirements(suggestRequirements("Benefits\nThe company offers insurance.\nRequirements\n- Proficiency in illustration.")).length, 1);

const syntheticResume = `Creative & Brand Director | 2013–Present
Oversaw production of integrated creative campaigns from briefing to launch.
Cut average campaign timelines by introducing shared intake.
Trained staff in art direction and quality review.
Built an in-house creative studio.
Redesigned creative intake and review cycles.
Piloted an automated production workflow.
Presented recommendations to executive stakeholders.`;
const results = compareResume(syntheticResume, requirements);
assert.match(results[0].evidence, /Creative & Brand Director/);
assert.match(results[0].note, /dated work history/);
assert.match(results[1].evidence, /2013/);
assert.match(results[1].note, /which alternative/);
assert.match(results[2].evidence, /from briefing to launch/);
assert.equal(results[3].evidence, null);
assert.match(results[4].evidence, /timelines/);
assert.match(results[5].evidence, /Trained staff/);
assert.match(results[6].evidence, /in-house creative studio/);
assert.match(results[7].evidence, /creative intake/);
assert.match(results[8].evidence, /Piloted/);
assert.match(results[9].evidence, /Presented/);
const unrelated = compareResume("Seasonal logistics clerk\nHandled inventory counts", requirements);
assert.equal(unrelated.filter(row => row.evidence).length, 0);

const singlePdfLine = "Background materials compiled ".repeat(40) +
  "Senior Director, Brand, Creative & Marketing | Apr 2011 – Mar 2026 " +
  "Other details ".repeat(40);
const [creativeExperience, alternative] = compareResume(singlePdfLine, requirements.slice(0, 2));
assert.match(creativeExperience.evidence, /Senior Director, Brand, Creative & Marketing/);
assert.match(alternative.evidence, /2011 – Mar 2026/);
assert.match(alternative.note, /which alternative/);

const keywordList = "Brand Governance • Executive Influence • Creative Partnerships • Brand Measurement";
const keywordsOnly = compareResume(keywordList, [requirements[0], requirements[5]]);
assert.equal(keywordsOnly[0].evidence, null);
assert.equal(keywordsOnly[1].evidence, null);
const roleHistory = `Creative Executive
Senior Director, Brand and Creative | Apr 2011 – Mar 2026
${keywordList}
Presented creative recommendations to the Senior Director.
Trained staff in art direction.
Bachelor of Arts, Art & Design`;
const grounded = compareResume(roleHistory, [requirements[0], requirements[1], requirements[5]]);
assert.match(grounded[0].evidence, /Senior Director, Brand and Creative.*2011/);
assert.match(grounded[0].note, /dated work history/);
assert.match(grounded[1].evidence, /Bachelor of Arts/);
assert.match(grounded[1].note, /degree alternative/);
assert.match(grounded[2].evidence, /Trained staff/);
console.log("Amazon regression: filters footers and prioritizes dated roles, degree alternatives, and explicit coaching or training evidence.");
