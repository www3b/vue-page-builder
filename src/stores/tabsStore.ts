import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { generateUUID, generateSlug } from '@/utils';
import { useSectionsStore } from '@/stores/sectionsStore';

export type Tab = {
  id: string;
  name: string;
  slug: string;
};

export type TabsState = {
  activeTabId: string | null;
  tabs: Tab[];
};

const HomeTab: Tab = {
  id: 'home',
  name: 'Home',
  slug: '/',
};

export const useTabsStore = defineStore('projectTabs', () => {
  const activeTabId = ref<string | null>(null);
  const tabs = ref<Tab[]>([HomeTab]);

  const tabsList = computed(() => tabs.value);

  const activeTab = computed(() => {
    return tabs.value.find((tab) => tab.id === activeTabId.value) || null;
  });

  function setActiveTab(tabId: string) {
    activeTabId.value = tabId;
  }

  function add(tabName: string) {
    const _tabName = tabName.trim();
    const newTab: Tab = {
      id: generateUUID(),
      name: _tabName,
      slug: generateSlug(_tabName),
    };

    tabs.value.push(newTab);
  }

  function remove(tabId: string) {
    const sectionsStore = useSectionsStore();
    const tabIndex = tabs.value.findIndex((t) => t.id === tabId);
    tabs.value = tabs.value.filter((t) => t.id != tabId);
    sectionsStore.removeByTab(tabId);

    return tabIndex;
  }

  function update(tab: Tab) {
    tabs.value = tabs.value.map((t) => (t.id === tab.id ? tab : t));
  }

  function getState(): TabsState {
    return {
      activeTabId: activeTabId.value,
      tabs: tabs.value,
    };
  }

  function hydrate(state?: TabsState) {
    if (!state) return;
    activeTabId.value = state.activeTabId ?? null;
    tabs.value = Array.isArray(state.tabs) ? state.tabs : tabs.value;
  }

  return {
    tabsList,
    activeTab,
    getState,
    hydrate,
    setActiveTab,
    add,
    remove,
    update,
  };
});
