SwiftScan Lite — Offline Scanner v2.0
====================================

DEPLOY TO NETLIFY DROP
1. Extract this ZIP on your phone or computer.
2. Open https://app.netlify.com/drop while online.
3. Upload the extracted swiftscan-lite folder (or the folder contents).
4. Open the HTTPS URL Netlify provides in Chrome.
5. Wait for the first visit to finish caching, then use Chrome menu > Install app / Add to Home screen.
6. Test by reopening the installed app with Wi-Fi and mobile data turned off.

FEATURES
- Local welcome, sign-in and create-profile screens; optional guest mode.
- First-run guided tutorial.
- Install callout with install button.
- Camera capture and image import.
- Import existing PDF files for preview, printing and download.
- Convert images and plain-text/Markdown/CSV/HTML files to PDF offline.
- Print preview for generated scan PDFs and imported PDFs.
- Search, sort, rename, rotate pages, delete scans, export PDFs, backup/restore.
- Dark/light/system theme and offline service-worker cache.

SUPPORTED IMPORT TYPES
Images: common browser-supported image types.
PDF: imported and retained as a PDF for preview/print/download.
Text documents: TXT, MD, CSV, HTML/HTM converted into PDF pages.
DOCX: basic text extraction is supported on modern browsers with DecompressionStream; complex layouts, tables and images may not be preserved. If conversion fails, export it as PDF or TXT first.

IMPORTANT LIMITATIONS
- This is an installable Progressive Web App (PWA), not a compiled native APK.
- Browser security does not permit unrestricted access to all phone storage. Use the system file picker and grant the files you want to import.
- Camera access requires HTTPS and browser permission.
- Profiles are stored locally in this browser only; they are not secure server accounts and do not sync. Do not reuse an important password. Guest mode is available.
- Scans are saved in browser storage, which has device/browser quotas. Export backups regularly and avoid importing very large PDFs.
- Offline mode works after the first successful online visit and service-worker caching. Clearing browser data can remove saved scans and profile data.
- OCR and automatic page-edge detection are not included.
