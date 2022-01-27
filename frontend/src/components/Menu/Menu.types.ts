import { CSSProperties, ReactNode } from 'react';

export interface MenuProps {
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
  children: ReactNode;
}
