import { ref, shallowRef } from 'vue';

export type StoreIndex = {
  name: string;
  keyPath: string | string[];
  options?: IDBIndexParameters;
};

export type StoreDefinition = {
  name: string;
  options?: IDBObjectStoreParameters;
  indexes?: StoreIndex[];
};

export type UseDBOptions = {
  name: string;
  version?: number;
  store?: string;
  stores?: StoreDefinition[];
};

export type UseDBStatus = 'idle' | 'opening' | 'ready' | 'error';

const DEFAULT_STORE = 'kv';

export function useDB(options: UseDBOptions) {
  const isSupported = typeof indexedDB !== 'undefined';
  const status = ref<UseDBStatus>('idle');
  const error = shallowRef<Error | null>(null);

  let dbPromise: Promise<IDBDatabase> | null = null;

  const resolvedStores: StoreDefinition[] = (() => {
    if (options.stores && options.stores.length > 0) {
      const hasDefault = options.store
        ? options.stores.some((store) => store.name === options.store)
        : true;
      if (!hasDefault && options.store) {
        return [...options.stores, { name: options.store }];
      }
      return options.stores;
    }

    return [{ name: options.store ?? DEFAULT_STORE }];
  })();

  const defaultStore = options.store ?? resolvedStores[0]?.name ?? DEFAULT_STORE;

  function requestToPromise<T>(request: IDBRequest<T>) {
    return new Promise<T>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
    });
  }

  function transactionToPromise(tx: IDBTransaction) {
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    });
  }

  function ensureSupported() {
    if (!isSupported) {
      const err = new Error('IndexedDB is not available in this environment.');
      error.value = err;
      status.value = 'error';
      throw err;
    }
  }

  function open(): Promise<IDBDatabase> {
    ensureSupported();

    if (dbPromise) return dbPromise;

    status.value = 'opening';

    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(options.name, options.version);

      request.onupgradeneeded = () => {
        const db = request.result;
        resolvedStores.forEach((storeDef) => {
          let store: IDBObjectStore;
          if (!db.objectStoreNames.contains(storeDef.name)) {
            store = db.createObjectStore(storeDef.name, storeDef.options);
          } else {
            store = request.transaction?.objectStore(storeDef.name) as IDBObjectStore;
          }

          storeDef.indexes?.forEach((indexDef) => {
            if (!store.indexNames.contains(indexDef.name)) {
              store.createIndex(indexDef.name, indexDef.keyPath, indexDef.options);
            }
          });
        });
      };

      request.onsuccess = () => {
        status.value = 'ready';
        resolve(request.result);
      };

      request.onerror = () => {
        const err = request.error ?? new Error('Failed to open IndexedDB');
        error.value = err;
        status.value = 'error';
        reject(err);
      };
    });

    return dbPromise;
  }

  async function withStore<T>(
    mode: IDBTransactionMode,
    storeName: string,
    handler: (store: IDBObjectStore) => IDBRequest<T>,
  ) {
    const db = await open();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = handler(store);
    const result = await requestToPromise<T>(request);
    await transactionToPromise(tx);
    return result;
  }

  function get<T = unknown>(key: IDBValidKey, storeName = defaultStore) {
    return withStore<T | undefined>('readonly', storeName, (store) => store.get(key));
  }

  function getAll<T = unknown>(storeName = defaultStore) {
    return withStore<T[]>('readonly', storeName, (store) => store.getAll());
  }

  function getAllKeys(storeName = defaultStore) {
    return withStore<IDBValidKey[]>('readonly', storeName, (store) => store.getAllKeys());
  }

  async function set<T = unknown>(key: IDBValidKey, value: T, storeName = defaultStore) {
    console.log(`Saving key "${key}" to IndexedDB store "${storeName}"`, value);
    await withStore<IDBValidKey>('readwrite', storeName, (store) => store.put(value, key));
  }

  async function del(key: IDBValidKey, storeName = defaultStore) {
    await withStore<undefined>('readwrite', storeName, (store) => store.delete(key));
  }

  async function clear(storeName = defaultStore) {
    await withStore<undefined>('readwrite', storeName, (store) => store.clear());
  }

  function close() {
    if (!dbPromise) return;
    dbPromise.then((db) => db.close()).catch(() => undefined);
    dbPromise = null;
    status.value = 'idle';
  }

  return {
    isSupported,
    status,
    error,
    open,
    get,
    getAll,
    getAllKeys,
    set,
    del,
    clear,
    close,
  };
}
