import { ReactNode } from 'react';

export interface CollapseButtonProps {
  collapse: boolean;
  onClick: (e: any) => void;
  children: ReactNode;
}
