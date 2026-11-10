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
