import { cp, mkdir } from "node:fs/promises";

await mkdir("dist/vendor", { recursive: true });
await Promise.all([
  cp("index.html", "dist/index.html"),
  cp("resume-import.mjs", "dist/resume-import.mjs"),
  cp("node_modules/@zip.js/zip.js/dist/zip.js", "dist/vendor/zip.js"),
  cp("node_modules/@zip.js/zip.js/LICENSE", "dist/vendor/ZIP-LICENSE"),
  cp("node_modules/pdfjs-dist/build/pdf.min.mjs", "dist/vendor/pdf.min.mjs"),
  cp("node_modules/pdfjs-dist/build/pdf.worker.min.mjs", "dist/vendor/pdf.worker.min.mjs"),
  cp("node_modules/pdfjs-dist/LICENSE", "dist/vendor/PDFJS-LICENSE"),
  ...["cmaps", "standard_fonts", "wasm"].map((name) =>
    cp("node_modules/pdfjs-dist/" + name, "dist/vendor/" + name, { recursive: true })
  ),
]);
