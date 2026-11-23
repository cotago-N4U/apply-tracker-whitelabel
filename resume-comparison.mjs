const maxRequirements = 25;
const genericWords = new Set((
  "a an and as at be by can for from have in into is it of on or our the their this to using with you your " +
  "ability able advanced demonstrated excellent experience experienced expertise good knowledge minimum must " +
  "plus preferred required skill skills solid strong understanding years year work working projects tasks " +
  "exceptional environment proven history professional"
).split(" "));
const headingPatterns = [
  ["Preferred", /^(?:(?:preferred|desired|nice.to.have|bonus)(?:\s+(?:qualifications|requirements|skills|experience))?|what (?:would be|will be) a plus)$/i],
  ["Required", /^(?:requirements|required(?:\s+(?:qualifications|requirements|skills|experience))?|(?:minimum|basic|essential|must.have)\s+(?:qualifications|requirements|skills|experience))$/i],
  ["Unspecified", /^(?:qualifications|what you(?: will|'ll)? (?:bring|need)|education and experience|skills and experience|knowledge, skills and abilities)$/i],
  ["Ignore", /^(?:about (?:us|the role|the company)|responsibilities|(?:key|core|essential) (?:responsibilities|duties)|what you(?: will|'ll) do|(?:pay|salary|compensation)(?: range| and benefits)?|benefits|what we offer|equal (?:employment )?opportunity|eeo|how to apply|accommodations)$/i],
];
const bullet = /^\s*(?:[•●▪◦‣*–—-]|\d{1,2}[.)])\s+/u;
const qualification = /\b(?:years? of|experience (?:in|with|leading|managing)|ability to|proficien(?:t|cy)|bachelor|master(?:'s)? degree|certification|working knowledge|track record|demonstrated|strong\s+\w+\s+skills)\b/i;
const postingFooter = /\bis an equal (?:employment )?opportunity employer\b|\b(?:does not discriminate|legally protected status|inclusive culture empowers)\b|\b(?:if you (?:have a disability|need)|to request an accommodation|please contact your recruiting partner)\b|\/how-we-hire\/accommodations|\b(?:USD|CAD|GBP|EUR)\s+(?:annually|per year|per hour)\b|\b(?:base pay|salary|compensation)\s+(?:range|for (?:this|the) (?:role|position))\b|^\$\s*\d[\d,.]*\s*(?:–|—|-|to)\s*\$?\s*\d/i;

// These cues locate related evidence. They do not verify every clause in a requirement.
const evidenceCues = [
  [/\b(?:creative executive|executive creative|creative leadership)\b/i,
    /\b(?:creative|creativity)\b/i, /\b(?:executive|director|vp|vice president|head of|chief)\b/i],
  [/\bprofessional experience\b/i,
    /\b(?:19|20)\d{2}\s*[-–—]\s*(?:present|current|(?:19|20)\d{2})\b/i],
  [/\bbachelor(?:['’]s)?\b/i,
    /\b(?:bachelor\w*|baccalaureate|BFA|BBA|BSc|B\.[AS]\.?)\b|\b(?:BA|BS) in\b/i],
  [/\b(?:concept to completion|creative input|creative development and execution|end.to.end)\b/i,
    /\b(?:creative|campaign|design|production)\w*\b/i, /\b(?:end.to.end|from (?:brief|concept|ideation).{0,90}(?:launch|delivery|completion|production)|(?:managed|oversaw|led).{0,50}(?:production|execution|delivery))\b/i],
  [/\bfast.paced\b/i,
    /\b(?:fast.paced|high.volume|rapid.turnaround|tight deadlines|quick.turn)\b/i],
  [/\b(?:meet deadlines|work proactively|deliver on projects|work .*independently)\b/i,
    /\b(?:on.time|tight deadlines|met deadlines|ahead of schedule|independently (?:led|delivered)|(?:reduced|cut|shortened).{0,50}(?:turnaround|timelines|delivery times))\b/i],
  [/\b(?:mentor\w*|coach\w*)\b/i,
    /\b(?:mentor\w*|coach\w*|trained (?:staff|team|colleagues)|developed (?:staff|direct reports))\b/i],
  [/\b(?:internal corporate agency|in.house agency|advertising agency)\b/i,
    /\b(?:advertising agency|in.house (?:creative|agency|studio)|internal (?:creative|agency|studio))\b/i],
  [/\b(?:creative development processes|creative process|creative workflow)\w*\b/i,
    /\b(?:creative|design|production)\b/i, /\b(?:intake|workflow\w*|process\w*|systems|review cycles)\b/i],
  [/\binnovati\w*\b/i, /\b(?:innovation|piloted|prototyped|automated|experimented|modernized)\b/i],
  [/\b(?:collaboration|collaborate|stakeholder\w*)\b/i,
    /\b(?:cross.functional|partnered with|collaborat\w*|stakeholder\w*)\b/i],
  [/\bpresentation\w*\b/i,
    /\b(?:present(?:ed|ations?)|briefed|pitched|facilitated (?:reviews|workshops))\b/i],
];

export function suggestRequirements(description) {
  const suggestions = [];
  let section;
  for (const raw of description.split(/\r?\n/)) {
    const line = raw.replace(bullet, "").trim();
    if (!line) continue;
    const heading = headingPatterns.find(([, pattern]) => pattern.test(line.replace(/:\s*$/, "")));
    if (heading) {
      section = heading[0];
      continue;
    }
    if (postingFooter.test(line)) {
      section = "Ignore";
      continue;
    }
    if (section === "Ignore" || line.length < 8 || line.length > 600) continue;
    if (!section && !qualification.test(line)) continue;
    if (!/[\p{L}\p{N}]/u.test(line)) continue;
    suggestions.push((section ?? "Unspecified") + ": " + line);
    if (suggestions.length === maxRequirements) break;
  }
  return [...new Set(suggestions)].join("\n");
}

export function readRequirements(value) {
  const rows = [];
  const seen = new Set();
  for (const raw of value.split(/\r?\n/)) {
    const line = raw.replace(bullet, "").trim();
    if (!line) continue;
    const prefix = /^(required|preferred|unspecified)\s*:\s*/i.exec(line);
    const text = prefix ? line.slice(prefix[0].length).trim() : line;
    if (!text || postingFooter.test(text) || seen.has(text.toLowerCase())) continue;
    seen.add(text.toLowerCase());
    rows.push({ category: prefix ? prefix[1].toLowerCase() : "unspecified", text });
  }
  return rows;
}

function words(value) {
  const plain = value.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "");
  return plain.match(/[\p{L}\p{N}]+(?:[+#]+)?/gu) ?? [];
}

function stem(word) {
  const singular = word.length > 4 && !word.endsWith("ss") ? word.replace(/ies$/, "y").replace(/s$/, "") : word;
  if (singular.length <= 5) return singular;
  return singular.replace(/(?:ing|ed)$/, "").replace(/e$/, "");
}

function terms(value) {
  return [...new Set(words(value).filter((word) => word.length > 1 && !genericWords.has(word) && !/^\d+$/.test(word)).map(stem))];
}

function candidateLines(resume) {
  const rows = resume.split(/\r?\n/).flatMap((raw) =>
    raw.trim().split(/(?<=[.!?])\s+(?=[A-Z])/).map((text) => text.trim()));
  return rows.flatMap((line, index) => {
    if (!line || line.length > 1000) return [];
    const next = rows[index + 1];
    const joined = next && !/[.!?]$/.test(line) && !bullet.test(next) && next.length < 300
      ? line + " " + next : null;
    return [line, ...(joined && joined.length <= 450 ? [joined] : [])];
  });
}

export function compareResume(resume, requirements) {
  const termIndex = new Map();
  const candidates = [...new Set(candidateLines(resume))];
  for (const text of candidates) {
    for (const word of terms(text)) {
      if (!termIndex.has(word)) termIndex.set(word, []);
      termIndex.get(word).push(text);
    }
  }
  return requirements.map((requirement) => {
    const alternatives = requirement.text.split(/,?\s+or\s+/i);
    let best;
    for (const clause of alternatives) {
      const selectedTerms = terms(clause);
      const minimum = Math.ceil(selectedTerms.length * (2 / 3));
      const counts = new Map();
      for (const term of selectedTerms) {
        for (const text of termIndex.get(term) ?? []) counts.set(text, (counts.get(text) ?? 0) + 1);
      }
      const matchingCues = evidenceCues.filter(([prompt]) => prompt.test(clause));
      for (const text of candidates) {
        const shared = counts.get(text) ?? 0;
        const cueWeight = matchingCues.reduce((total, [, ...cues], index) =>
          total + (cues.every((cue) => cue.test(text)) ? (index === 0 ? 3 : 2) : 0), 0);
        const wording = shared > 0 && shared >= minimum && (selectedTerms.length === 1 || shared >= 2);
        if (!wording && !cueWeight && shared < 2) continue;
        const strength = (wording ? 4 : 0) + cueWeight + (shared / Math.max(1, selectedTerms.length));
        if (!best || strength > best.strength || (strength === best.strength && text.length < best.text.length)) {
          best = { text, strength, wording };
        }
      }
    }
    const checkYears = /\b\d+\s*(?:\+\s*)?years?\b/i.test(requirement.text);
    const note = alternatives.length > 1 && checkYears
      ? "Verify which alternative you meet and check the duration if you’re using experience."
      : checkYears ? "Verify the number of years against your dated work history."
      : alternatives.length > 1 ? "Verify which alternative you meet." : "";
    return { ...requirement, evidence: best?.text ?? null, wording: best?.wording ?? false, note };
  });
}

export { maxRequirements };
