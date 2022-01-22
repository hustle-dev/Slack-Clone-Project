import { CSSProperties, ReactNode } from 'react';

export interface MenuProps {
  children: ReactNode;
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}
