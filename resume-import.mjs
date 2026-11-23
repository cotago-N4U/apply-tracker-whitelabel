const maxFileBytes = 10 * 1024 * 1024;
const maxTextLength = 85000;
const maxDocumentXmlBytes = 4 * 1024 * 1024;
const maxPdfPages = 30;
const wordNamespaces = new Set([
  "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
  "http://purl.oclc.org/ooxml/wordprocessingml/main",
]);

const byId = (id) => document.getElementById(id);
const details = byId("resume-import");
const fileInput = byId("resume-file");
const textarea = byId("resume-text");
const confirm = byId("confirm-resume-text");
const clear = byId("clear-resume-text");
const status = byId("resume-import-status");
const error = byId("resume-import-error");
let importing = false;
let zipModule;

class ImportError extends Error {}

function setError(message = "") {
  error.textContent = message;
  error.hidden = !message;
}

function refreshControls() {
  fileInput.disabled = importing;
  textarea.readOnly = importing;
  confirm.disabled = importing || !textarea.value.trim();
  clear.disabled = importing || !textarea.value;
}

function vendor(name) {
  return new URL("./vendor/" + name, import.meta.url).href;
}

async function readPdf(file) {
  const pdfjs = await import(vendor("pdf.min.mjs"));
  pdfjs.GlobalWorkerOptions.workerSrc = vendor("pdf.worker.min.mjs");
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    cMapUrl: vendor("cmaps/"),
    cMapPacked: true,
    standardFontDataUrl: vendor("standard_fonts/"),
    wasmUrl: vendor("wasm/"),
    isEvalSupported: false,
    useSystemFonts: false,
  });
  try {
    const pdf = await task.promise;
    if (pdf.numPages > maxPdfPages) {
      throw new ImportError("This PDF is longer than 30 pages. Paste the relevant résumé text.");
    }
    const pages = [];
    for (let index = 1; index <= pdf.numPages; index++) {
      const page = await pdf.getPage(index);
      const content = await page.getTextContent();
      const text = content.items.map((item) => {
        if (!("str" in item)) return "";
        return item.str + (item.hasEOL ? "\n" : " ");
      }).join("");
      pages.push(text);
      page.cleanup();
      if (pages.join("\n\n").length > maxTextLength) {
        throw new ImportError("This résumé is too long for the preview. Paste the relevant sections.");
      }
    }
    return pages.join("\n\n");
  } catch (cause) {
    if (cause.name === "PasswordException") {
      throw new ImportError("This PDF is password protected. Upload an unlocked copy or paste the text.");
    }
    throw cause;
  } finally {
    await task.destroy();
  }
}

function loadZip() {
  zipModule ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = vendor("zip.js");
    script.onload = () => resolve(globalThis.zip);
    script.onerror = () => {
      zipModule = undefined;
      reject(new ImportError("The DOCX reader could not load. Try again or paste the text."));
    };
    document.head.append(script);
  });
  return zipModule;
}

async function readDocx(file) {
  const { ZipReader, BlobReader, TextWriter } = await loadZip();
  const reader = new ZipReader(new BlobReader(file), { useWebWorkers: false });
  try {
    const entries = await reader.getEntries();
    const main = entries.find((entry) => entry.filename === "word/document.xml" && !entry.directory);
    if (!main) throw new ImportError("This file does not contain a readable Word document.");
    if (main.uncompressedSize > maxDocumentXmlBytes) {
      throw new ImportError("This Word document is too large to read. Paste the relevant sections.");
    }
    const xml = await main.getData(new TextWriter(), { checkSignature: true });
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const wordNamespace = doc.documentElement.namespaceURI;
    if (!wordNamespaces.has(wordNamespace)) throw new ImportError("This Word document could not be read.");
    return Array.from(doc.getElementsByTagNameNS(wordNamespace, "p"), (paragraph) =>
      Array.from(paragraph.getElementsByTagNameNS(wordNamespace, "*"), (node) => {
        if (node.closest("p") !== paragraph) return "";
        if (node.localName === "t") return node.textContent;
        if (node.localName === "tab") return "\t";
        if (node.localName === "br" || node.localName === "cr") return "\n";
        return "";
      }).join("")
    ).join("\n");
  } finally {
    await reader.close();
  }
}

async function importFile(file) {
  if (file.size > maxFileBytes) throw new ImportError("Choose a file under 10 MB or paste the text.");
  const extension = file.name.split(".").at(-1)?.toLowerCase();
  let text;
  switch (extension) {
    case "pdf": text = await readPdf(file); break;
    case "docx": text = await readDocx(file); break;
    case "txt": text = await file.text(); break;
    default: throw new ImportError("Choose a PDF, DOCX, or TXT file, or paste the text.");
  }
  text = text.replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n").trim();
  if (!text) {
    throw new ImportError("No selectable text was found. Paste the text or upload a text-based copy.");
  }
  if (text.length > maxTextLength) throw new ImportError("This résumé is too long. Paste the relevant sections.");
  return text;
}

byId("own-resume-link").addEventListener("click", (event) => {
  event.preventDefault();
  details.open = true;
  fileInput.focus({ preventScroll: true });
  details.scrollIntoView({ block: "start" });
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  importing = true;
  setError();
  status.textContent = "Extracting text…";
  refreshControls();
  try {
    textarea.value = await importFile(file);
    status.textContent = "Text extracted. Check the reading order and edit anything that needs correction.";
    textarea.focus();
  } catch (cause) {
    status.textContent = "";
    setError(cause instanceof ImportError ? cause.message : "This file could not be read. Try another file or paste the text.");
  } finally {
    fileInput.value = "";
    importing = false;
    refreshControls();
  }
});

textarea.addEventListener("input", () => {
  status.textContent = "";
  setError();
  refreshControls();
});

byId("resume-import-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (importing || !textarea.value.trim()) return;
  textarea.value = textarea.value.trim();
  status.textContent = "Résumé text confirmed for this session. The sample job and sample score use the fictional profile.";
});

clear.addEventListener("click", () => {
  textarea.value = "";
  setError();
  status.textContent = "Résumé text cleared.";
  refreshControls();
  textarea.focus();
});

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  textarea.value = "";
  status.textContent = "";
  setError();
  refreshControls();
});
textarea.value = "";
refreshControls();
