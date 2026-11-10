const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function makeEnvironment({ indexed = true, initialLegacy = null } = {}) {
  const local = new Map();
  if (initialLegacy !== null) local.set("swiftscan-lite-documents-v1", JSON.stringify(initialLegacy));
  const localStorage = {
    getItem(key) { return local.has(key) ? local.get(key) : null; },
    setItem(key, value) { local.set(key, String(value)); },
    removeItem(key) { local.delete(key); }
  };
  const stores = new Map();
  const indexedDB = indexed ? {
    open(name) {
      const request = {};
      queueMicrotask(() => {
        let database = stores.get(name);
        const isNew = !database;
        if (!database) {
          const objectStores = new Map();
          database = {
            objectStoreNames: { contains: key => objectStores.has(key) },
            createObjectStore(key) { objectStores.set(key, new Map()); },
            transaction(storeName) {
              const records = objectStores.get(storeName);
              const tx = { error: null };
              tx.objectStore = () => ({
                getAll() {
                  const req = {};
                  queueMicrotask(() => {
                    req.result = [...records.values()].map(value => structuredClone(value));
                    req.onsuccess?.({ target: req });
                    tx.oncomplete?.({ target: tx });
                  });
                  return req;
                },
                clear() { records.clear(); queueMicrotask(() => tx.oncomplete?.({ target: tx })); },
                put(value) { records.set(value.id, structuredClone(value)); }
              });
              return tx;
            }
          };
          stores.set(name, database);
        }
        request.result = database;
        if (isNew) request.onupgradeneeded?.({ target: request });
        request.onsuccess?.({ target: request });
      });
      return request;
    }
  } : undefined;
  const context = { localStorage, indexedDB, console, Promise, Map, Object, Array, TypeError, Error, JSON, globalThis: null };
  context.globalThis = context;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "storage.js"), "utf8"), context);
  return { api: context.ScannityStorage, localStorage };
}

(async () => {
  {
    const env = makeEnvironment();
    const docs = [{ id: "scan-a", name: "Invoice", pages: [{ data: "data:image/jpeg;base64,AA==" }] }];
    const result = await env.api.save(docs);
    assert.equal(result.backend, "indexeddb");
    assert.deepEqual(JSON.parse(JSON.stringify(await env.api.load())), docs);
  }
  {
    const legacy = [{ id: "old-scan", name: "Legacy scan", pages: [] }];
    const env = makeEnvironment({ initialLegacy: legacy });
    assert.deepEqual(JSON.parse(JSON.stringify(await env.api.load())), legacy);
    assert.equal(env.localStorage.getItem("swiftscan-lite-documents-v1"), null);
    const updated = [...legacy, { id: "new-scan", name: "New scan", pages: [] }];
    await env.api.save(updated);
    assert.deepEqual(JSON.parse(JSON.stringify(await env.api.load())), updated);
  }
  {
    const env = makeEnvironment({ indexed: false });
    const docs = [{ id: "fallback", name: "Fallback scan", pages: [] }];
    const result = await env.api.save(docs);
    assert.equal(result.backend, "localstorage");
    assert.equal(result.warning, true);
    assert.deepEqual(JSON.parse(JSON.stringify(await env.api.load())), docs);
  }
  {
    const env = makeEnvironment();
    const older = [{ id: "same-id", name: "Older IDB snapshot", pages: [] }];
    const newer = [{ id: "same-id", name: "Newer fallback snapshot", pages: [] }];
    await env.api.save(older);
    env.localStorage.setItem("swiftscan-lite-documents-v1", JSON.stringify(newer));
    assert.deepEqual(JSON.parse(JSON.stringify(await env.api.load())), newer);
    assert.equal(env.localStorage.getItem("swiftscan-lite-documents-v1"), null);
  }
  {
    const env = makeEnvironment();
    const docs = [{ id: "keep-me", name: "Existing scan", pages: [] }];
    await env.api.save(docs);
    await assert.rejects(env.api.save([{ name: "Missing ID" }]));
    assert.deepEqual(JSON.parse(JSON.stringify(await env.api.load())), docs);
  }
  console.log("5 storage adapter tests passed");
})().catch(error => { console.error(error); process.exitCode = 1; });
