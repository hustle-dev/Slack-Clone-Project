import { ChangeEvent, SyntheticEvent, ReactNode } from 'react';

export interface IFormNormalProps {
  id?: string;
  children?: ReactNode;
}

export interface IFormProps extends IFormNormalProps {
  onSubmit: (e: SyntheticEvent) => void;
}

export interface IFormButtonProps extends IFormNormalProps {
  type: 'submit';
}

export interface IFormInputProps extends IFormNormalProps {
  type: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
