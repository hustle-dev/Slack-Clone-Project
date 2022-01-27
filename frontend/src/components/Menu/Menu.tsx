import React, { useCallback } from 'react';
import { CreateMenu, CloseModalButton } from './Menu.styles';
import { MenuProps } from './Menu.types';

export default function Menu({ style, show, onCloseModal, closeButton, children }: MenuProps) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateMenu onClick={onCloseModal}>
      <div role="button" tabIndex={0} onClick={stopPropagation} onKeyDown={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
}

Menu.defaultProps = {
  closeButton: true,
};
