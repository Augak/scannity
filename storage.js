/* Scannity document persistence: IndexedDB first, legacy localStorage migration/fallback. */
(() => {
  "use strict";
  const DB_NAME = "scannity-local-documents-v1";
  const STORE_NAME = "scans";
  const LEGACY_KEY = "swiftscan-lite-documents-v1";
  let databasePromise;
  function openDatabase() {
    if (!globalThis.indexedDB) return Promise.reject(new Error("IndexedDB is unavailable"));
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open local document storage"));
      request.onblocked = () => reject(new Error("Local document storage upgrade is blocked"));
    });
    return databasePromise;
  }
  function requestValue(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Local storage request failed"));
    });
  }
  function transactionFinished(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Local storage transaction failed"));
      transaction.onabort = () => reject(transaction.error || new Error("Local storage transaction was aborted"));
    });
  }
  async function readIndexedDocuments() {
    const database = await openDatabase();
    const transaction = database.transaction(STORE_NAME, "readonly");
    const finished = transactionFinished(transaction);
    const rows = await requestValue(transaction.objectStore(STORE_NAME).getAll());
    await finished;
    return Array.isArray(rows) ? rows : [];
  }
  function validateDocuments(documents) {
    if (!Array.isArray(documents)) throw new TypeError("Scannity storage expects an array of scans");
    for (const document of documents) {
      if (!document || typeof document.id !== "string" || !document.id) throw new Error("A saved scan is missing its local ID");
    }
  }
  async function writeIndexedDocuments(documents) {
    validateDocuments(documents);
    const database = await openDatabase();
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const finished = transactionFinished(transaction);
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
    for (const document of documents) store.put(document);
    await finished;
  }
  function readLegacyDocuments() {
    try {
      const value = localStorage.getItem(LEGACY_KEY);
      const parsed = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  async function load() {
    // The legacy key is also the write-through fallback if an IndexedDB save fails.
    // Prefer it so a newer fallback save cannot be hidden by an older IDB snapshot.
    const legacy = readLegacyDocuments();
    if (legacy.length) {
      try {
        await writeIndexedDocuments(legacy);
        try { localStorage.removeItem(LEGACY_KEY); } catch { /* migrated data is already in IndexedDB */ }
      } catch { /* keep using the localStorage copy if IndexedDB is unavailable */ }
      return legacy;
    }
    return readIndexedDocuments();
  }
  async function save(documents) {
    validateDocuments(documents);
    try {
      await writeIndexedDocuments(documents);
      try { localStorage.removeItem(LEGACY_KEY); } catch { /* IndexedDB is already authoritative */ }
      return { backend: "indexeddb", warning: false };
    } catch (indexedError) {
      try {
        localStorage.setItem(LEGACY_KEY, JSON.stringify(documents));
        return { backend: "localstorage", warning: true, error: indexedError };
      } catch (fallbackError) {
        fallbackError.cause = indexedError;
        throw fallbackError;
      }
    }
  }
  globalThis.ScannityStorage = Object.freeze({ load, save });
})();
