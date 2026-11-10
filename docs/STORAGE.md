# Scannity local document storage

## Why this change was needed

The previous release stored every scan, every page image, and imported PDF data in one localStorage JSON value. Browser localStorage has a small quota (commonly around 5 MiB per origin), so a few high-resolution pages or a PDF could make the next save fail. That is unsuitable for a document scanner.

## New behavior

- IndexedDB is now the primary store. Each scan is stored as a record keyed by its existing local scan ID.
- The previous localStorage key, swiftscan-lite-documents-v1, is read once when the IndexedDB store is empty.
- Legacy data is copied into IndexedDB before the old key is removed.
- Browsers that block or do not implement IndexedDB fall back to the old localStorage format and show a limited-storage warning.
- Writes are serialized by the app so rapid edits do not overtake earlier saves.
- No scan content is sent to a server.

## Data safety notes

IndexedDB increases the practical storage capacity but does not guarantee permanent retention. Browser storage can be evicted, cleared, or constrained by device free space. Users should export backups before clearing site data or changing browsers. Local profiles remain convenience-only and do not encrypt the documents.

## Verification

Run node tests/storage.test.cjs. The tests use a deterministic in-memory IndexedDB test double and cover normal save/load, one-time migration, and fallback behavior. A real Android Chrome test is still required for camera capture, larger multi-page scans, browser quota behavior, and app restart persistence.


Fallback precedence: if an IndexedDB write fails, the newer localStorage fallback copy takes precedence on the next launch. After it is successfully migrated back into IndexedDB, the fallback key is removed. Invalid scan records are rejected before a read-write transaction begins, so validation cannot clear an existing document store.
