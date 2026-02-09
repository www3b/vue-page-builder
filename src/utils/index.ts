import TextContainer from '@/components/sections/TextContainer.vue';
import TableContainer from '@/components/sections/TableContainer.vue';
import { SectionType } from '@/types/sections';

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function mapSectionToComponent(type: SectionType) {
  switch (type) {
    case SectionType.Text:
      return TextContainer;
    case SectionType.Table:
      return TableContainer;
    default:
      return;
  }
}
