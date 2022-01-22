import { ReactNode } from 'react';

export interface ModalProps {
  show: boolean;
  onCloseModal: () => void;
  children: ReactNode;
}
