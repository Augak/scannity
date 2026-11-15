# Scannity

A lightweight, privacy-first document scanner PWA. Capture pages with the device camera, import supported files, organise scans locally, and export PDFs without creating an account or uploading documents.

## Local preview

Serve the repository root over HTTP or HTTPS. For example, run a static server from the project directory and open its local address in a modern browser. Camera access requires HTTPS or localhost.

## Local storage and migration

New scans are stored in IndexedDB rather than localStorage so that multi-page documents and imported PDFs are not constrained by the small localStorage quota. On first launch after this update, Scannity migrates the previous swiftscan-lite-documents-v1 record into IndexedDB and removes the old copy after a successful migration. If IndexedDB is unavailable, the app falls back to localStorage and displays a limited-storage warning.

All scan data remains in the current browser profile on the device. Browser storage can still be cleared by the operating system or the user; use Settings > Backup scans regularly. The local profile screen is only a convenience and is not server authentication or encryption.

## Tests

Run the storage adapter tests with Node.js:

    node tests/storage.test.cjs

These tests cover IndexedDB-style save/load, legacy localStorage migration, and the compatibility fallback. They use a small in-memory IndexedDB test double; they do not replace physical-browser testing.

## Deployment

Deploy the repository root as a static site on an HTTPS host such as Netlify or GitHub Pages. Keep index.html, styles.css, app.js, storage.js, manifest.webmanifest, sw.js, and icon.svg at the same root level. The service worker caches the storage adapter as part of the offline app shell.

## Accessibility and device testing

Use TalkBack to verify the first-run tutorial, camera controls, import picker, scan list, editor actions, dialogs, and PDF preview. Test with large text, reduced motion, and narrow Android screens. Camera and file-picker behavior must be tested on a real device.


## Scannity 3.0 product direction

Scannity is an account-free, local-first scanning and file workspace. The web app opens directly into the workspace; there is no sign-in or registration requirement.

### Current workspace additions
- QR and barcode studio: QR generation and barcode generation (Code 128, EAN-13, UPC, Code 39 and ITF), with PNG/SVG export.
- Live camera and image-based code scanning where the browser exposes the Barcode Detection API.
- Universal reader: PDF preview, text/Markdown/RTF/SQL/JSON/XML, CSV tables, safe HTML preview/source, DOCX text extraction, XLS/XLSX sheet preview, PPTX slide-text extraction, and SQLite database table inspection.
- OCR for scanned image pages using Tesseract.js (English language data is downloaded on first use).
- Account-free launch, refreshed Scannity identity, loader, and an expanded tool workspace.

### Privacy and compatibility
Files are processed in the browser. Some reader engines are loaded from public CDNs when their feature is first used, so those specific tools require an internet connection on first use. The core PWA and locally saved scans remain available offline after the app shell has been cached. Avoid opening untrusted links from scanned QR codes; Scannity displays the result before the user chooses to open it.

### Planned quality upgrades
The next engineering phases are document boundary detection and perspective correction, image enhancement filters, searchable PDF text layers, multi-format document export/conversion, richer spreadsheet and presentation rendering, additional barcode decoder fallbacks, batch label generation, and device-level native camera/file integrations. These are planned enhancements, not claims that every format or premium feature is already complete.
