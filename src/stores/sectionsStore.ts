import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { generateUUID } from '@/utils';
import { SectionType } from '@/types/sections';

export type Section = {
  id: string;
  tabId: string;
  name: string;
  type: SectionType;
  data: SectionContent;
};

export type TextSectionData = {
  text: string;
};

export type TableSectionData = {
  columns: string[];
  rows: string[][];
};

export type SectionContent = TextSectionData | TableSectionData;

type SectionData = Omit<Section, 'id' | 'data'> & { data?: SectionContent };

export type SectionsState = {
  sections: Section[];
};

export const useSectionsStore = defineStore('sections', () => {
  const sectionsByTabId = ref<Record<string, Section[]>>(Object.create(null));

  const tabSectionMap = computed<Record<string, Section[]>>(() => sectionsByTabId.value);

  const sections = computed<Section[]>(() => {
    return Object.values(sectionsByTabId.value).flat();
  });

  function ensureTabBucket(tabId: string) {
    if (!Array.isArray(sectionsByTabId.value[tabId])) {
      sectionsByTabId.value[tabId] = [];
    }
    return sectionsByTabId.value[tabId];
  }

  function findSectionLocation(sectionId: string) {
    for (const [tabId, tabSections] of Object.entries(sectionsByTabId.value)) {
      const index = tabSections.findIndex((section) => section.id === sectionId);
      if (index === -1) continue;
      const section = tabSections[index];
      if (!section) continue;
      return { tabId, index, section, tabSections };
    }
    return null;
  }

  function add(section: SectionData) {
    const defaultData: SectionContent =
      section.type === SectionType.Table ? { columns: ['Column 1'], rows: [['']] } : { text: '' };

    const newSection: Section = {
      id: generateUUID(),
      ...section,
      data: section.data ?? defaultData,
    };
    ensureTabBucket(newSection.tabId).push(newSection);
  }

  function update(section: Section) {
    const location = findSectionLocation(section.id);
    if (!location) return;

    if (location.tabId !== section.tabId) {
      location.tabSections.splice(location.index, 1);
      ensureTabBucket(section.tabId).push(section);
      return;
    }

    location.tabSections[location.index] = section;
  }

  function updateData(sectionId: string, data: SectionContent) {
    const location = findSectionLocation(sectionId);
    if (!location) return;
    location.tabSections[location.index] = {
      ...location.section,
      data,
    };
  }

  function moveSection(tabId: string, fromIndex: number, toIndex: number) {
    const tabSections = sectionsByTabId.value[tabId] ?? [];
    if (tabSections.length === 0) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= tabSections.length || toIndex >= tabSections.length) return;
    if (fromIndex === toIndex) return;

    const [moved] = tabSections.splice(fromIndex, 1);
    if (!moved) return;
    tabSections.splice(toIndex, 0, moved);
  }

  function getSection(sectionId: string) {
    return findSectionLocation(sectionId)?.section;
  }

  function removeByTab(tabId: string) {
    if (!sectionsByTabId.value[tabId]) return;
    delete sectionsByTabId.value[tabId];
  }

  function getState(): SectionsState {
    return {
      sections: sections.value,
    };
  }

  function hydrate(state?: SectionsState) {
    sectionsByTabId.value = Object.create(null);
    if (!state || !Array.isArray(state.sections)) return;
    state.sections.forEach((section) => {
      ensureTabBucket(section.tabId).push(section);
    });
  }

  return {
    sections,
    tabSectionMap,
    add,
    update,
    updateData,
    moveSection,
    getSection,
    removeByTab,
    getState,
    hydrate,
  };
});
