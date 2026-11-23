const maxRequirements = 25;
const genericWords = new Set((
  "a an and as at be by can for from have in into is it of on or our the their this to using with you your " +
  "ability able advanced demonstrated excellent experience experienced expertise good knowledge minimum must " +
  "plus preferred required skill skills solid strong understanding years year"
).split(" "));
const headingPatterns = [
  ["Preferred", /^(?:(?:preferred|desired|nice.to.have|bonus)(?:\s+(?:qualifications|requirements|skills|experience))?|what (?:would be|will be) a plus)$/i],
  ["Required", /^(?:requirements|required(?:\s+(?:qualifications|requirements|skills|experience))?|(?:minimum|basic|essential|must.have)\s+(?:qualifications|requirements|skills|experience))$/i],
  ["Unspecified", /^(?:qualifications|what you(?: will|'ll)? (?:bring|need)|education and experience|skills and experience|knowledge, skills and abilities)$/i],
  ["Ignore", /^(?:about (?:us|the role|the company)|responsibilities|(?:key|core|essential) (?:responsibilities|duties)|what you(?: will|'ll) do|benefits|compensation|equal opportunity|how to apply)$/i],
];
const bullet = /^\s*(?:[•●▪◦‣*–—-]|\d{1,2}[.)])\s+/u;
const qualification = /\b(?:years? of|experience (?:in|with|leading|managing)|ability to|proficien(?:t|cy)|bachelor|master(?:'s)? degree|certification|working knowledge|track record|demonstrated|strong\s+\w+\s+skills)\b/i;

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
    if (!text || seen.has(text.toLowerCase())) continue;
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
  for (const text of new Set(candidateLines(resume))) {
    for (const word of terms(text)) {
      if (!termIndex.has(word)) termIndex.set(word, []);
      termIndex.get(word).push(text);
    }
  }
  return requirements.map((requirement) => {
    const selectedTerms = terms(requirement.text);
    const minimum = selectedTerms.length <= 2 ? selectedTerms.length : Math.max(2, Math.ceil(selectedTerms.length * 0.67));
    const counts = new Map();
    for (const term of selectedTerms) {
      for (const text of termIndex.get(term) ?? []) counts.set(text, (counts.get(text) ?? 0) + 1);
    }
    let best;
    for (const [text, shared] of counts) {
      if (shared < minimum) continue;
      if (!best || shared > best.shared || (shared === best.shared && text.length < best.text.length)) {
        best = { shared, text };
      }
    }
    return { ...requirement, evidence: best ? best.text : null };
  });
}

export { maxRequirements };
