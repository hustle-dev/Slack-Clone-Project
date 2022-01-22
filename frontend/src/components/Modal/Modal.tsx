import React, { PropsWithChildren, useCallback } from 'react';
import { CreateModal, CloseModalButton } from './Modal.styles';
import { ModalProps } from './Modal.types';

function Modal({ show, children, onCloseModal }: ModalProps) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateModal onClick={onCloseModal}>
      <div role="button" tabIndex={0} onClick={stopPropagation} onKeyDown={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
}

export default Modal;
