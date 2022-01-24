import React from 'react';
import { CollapsedButton } from './CollapseButton.styles';
import { CollapseButtonProps } from './CollapseButton.types';

export default function CollapseButton({ collapse, onClick, children }: CollapseButtonProps) {
  return (
    <CollapsedButton collapse={collapse} onClick={onClick}>
      {children}
    </CollapsedButton>
  );
}
