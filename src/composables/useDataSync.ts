import type { Pinia } from 'pinia';
import { toRaw } from 'vue';
import { useDB } from '@/composables/useDB';
import { useTabsStore } from '@/stores/tabsStore';
import { useSectionsStore } from '@/stores/sectionsStore';
import type { TabsState } from '@/stores/tabsStore';
import type { SectionsState } from '@/stores/sectionsStore';

type PersistedState = {
  tabs: TabsState;
  sections: SectionsState;
  savedAt: string;
};

const DB_NAME = 'page-builder';
const STORE_NAME = 'pinia';
const STATE_KEY = 'app-state';
const SYNC_INTERVAL_MS = 60_000;

function toPlain<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  const raw = toRaw(value as object);

  if (Array.isArray(raw)) {
    return raw.map((item) => toPlain(item)) as T;
  }

  const entries = Object.entries(raw).map(([key, val]) => [key, toPlain(val)]);
  return Object.fromEntries(entries) as T;
}

export function setupDataSync(pinia: Pinia) {
  const db = useDB({ name: DB_NAME, store: STORE_NAME });
  const tabsStore = useTabsStore(pinia);
  const sectionsStore = useSectionsStore(pinia);

  let intervalId: number | null = null;
  let isSyncing = false;

  async function hydrate() {
    if (!db.isSupported) return;
    await db.open();
    const stored = await db.get<PersistedState>(STATE_KEY);
    if (!stored) return;

    tabsStore.hydrate(stored.tabs);
    sectionsStore.hydrate(stored.sections);
  }

  async function sync() {
    if (!db.isSupported || isSyncing) return;
    isSyncing = true;

    try {
      const payload: PersistedState = {
        tabs: toPlain(tabsStore.getState()),
        sections: toPlain(sectionsStore.getState()),
        savedAt: new Date().toISOString(),
      };

      await db.set(STATE_KEY, payload);
    } finally {
      isSyncing = false;
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      void sync();
    }
  }

  function start() {
    void hydrate().catch((err) => {
      console.error('Failed to hydrate state from IndexedDB', err);
    });

    intervalId = window.setInterval(() => {
      void sync();
    }, SYNC_INTERVAL_MS);

    window.addEventListener('pagehide', sync);
    window.addEventListener('beforeunload', sync);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  function stop() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    window.removeEventListener('pagehide', sync);
    window.removeEventListener('beforeunload', sync);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }

  if (typeof window !== 'undefined') {
    start();
  }

  return {
    sync,
    stop,
  };
}
