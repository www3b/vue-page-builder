import TextIcon from '@/components/icons/Text.svg';
import TableIcon from '@/components/icons/Table.svg';
import { SectionType } from '@/types/sections';

export const INPUT_SECTION = {
  type: SectionType.Text,
  name: 'Text',
  icon: TextIcon,
};

export const TABLE_SECTION = {
  type: SectionType.Table,
  name: 'Table',
  icon: TableIcon,
};
