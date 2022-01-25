import { IDM } from 'typings/db';

export interface ChatListProps {
  chatSections: { [key: string]: IDM[] };
}
