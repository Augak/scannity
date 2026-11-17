# Scannity

**Scan. Read. Create. Convert.**

Scannity is an account-free, local-first document scanner and file workspace designed for mobile browsers and installable Android PWAs. It is being developed as a real web product first, with a path towards a native Android package.

## What is in the app

### Document scanner
- Capture multiple pages using the rear camera or import photos.
- Save documents locally in IndexedDB, with a localStorage fallback.
- Rotate, remove and reorder captured pages.
- Apply original, enhanced-colour and black-and-white looks.
- Run document edge detection and perspective correction on a captured page (OpenCV.js).
- Export multi-page PDFs and print previews.
- Run English OCR on scanned image pages, download extracted text, and create a searchable PDF with an invisible text layer.
- Back up and restore local scans; clear the app cache without deleting saved documents.

### QR and barcode studio
- Generate QR codes and download as SVG or PNG.
- Generate CODE128, EAN13, UPC, CODE39 and ITF barcodes.
- Scan codes from the camera or an image using the browser Barcode Detection API, with ZXing fallback when needed.
- The scanner displays decoded content; it does not automatically open links.

### Universal reader
- PDF: native browser PDF preview.
- Word: DOCX text extraction.
- Excel: XLS/XLSX workbook sheet preview and CSV table preview.
- PowerPoint: PPTX slide text extraction.
- Text and data: TXT, Markdown, RTF, JSON, XML and SQL.
- Web: safe HTML preview and source.
- Database: SQLite table listing and row preview.

Legacy binary DOC and PPT files are not supported in this browser build; convert them to DOCX/PPTX or PDF first. Office previews focus on readable content and are not full-fidelity editors.

## Privacy and offline use
- No registration, login or account wall.
- Documents and scans are processed in the browser and saved in the current browser profile on the device.
- Scannity does not send scan contents to a Scannity server.
- Camera access is requested only when the user starts scanning.
- Optional OCR, perspective-correction and document-reading engines are fetched from public CDNs when first used. The service worker caches approved engines for repeat offline use where the browser permits it.
- Browser storage can be cleared by the operating system or the user. Use Settings → Backup scans for important work.
- Do not open untrusted links from decoded QR codes.

## Run locally
Serve the repository root through localhost or HTTPS. Camera access requires a secure context. No build step or package installation is required for the PWA itself.

## Tests
Run:
```sh
npm test
```
The checks include JavaScript syntax validation, product smoke checks and IndexedDB/localStorage adapter tests. GitHub Actions runs them on pushes and pull requests.

## Deployment
The static app can be hosted from the repository root. GitHub Pages deployment is configured through `.github/workflows/pages.yml`; Netlify can also deploy the root directory with no build command. A hosting account may still enforce its own usage limits.

## Android readiness
This PWA is installable where supported and requests camera access at the point of use. It is not yet a signed native APK. Native packaging, hardware testing, permission flows, accessibility verification with TalkBack, and real-device QA remain separate release gates.

## Current engineering limitations
- Automatic crop is a one-tap assist; difficult images may require retaking the photo or manual correction in a later release.
- OCR currently targets English and scanned image pages; imported PDF OCR is not yet included.
- DOC/PPT legacy binary files and full Office editing are not included.
- External feature engines require a first download before their offline cache is available.
- Physical Android testing is required for camera focus, flash, storage quotas, large files, low-memory behaviour and install/update flows.

## Developer and related work

Scannity is part of the independent product work of [Kastine Augak](https://augak.github.io/kastineaugak.github.io/). Visit the official portfolio for project context, related products, research and contact information.
