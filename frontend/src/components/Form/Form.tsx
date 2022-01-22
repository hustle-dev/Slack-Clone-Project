import React from 'react';
import { Form as StyledForm, Label, Input, LinkContainer, Error, Button, Header, Success } from './Form.styles';
import { IFormButtonProps, IFormInputProps, IFormNormalProps, IFormProps } from './Form.types';

export default function Form(props: IFormProps) {
  return <StyledForm {...props} />;
}

Form.Header = function FormHeader(props: IFormNormalProps) {
  return <Header {...props} />;
};

Form.Label = function FormLabel(props: IFormNormalProps) {
  return <Label {...props} />;
};

Form.Input = function FormInput(props: IFormInputProps) {
  return <Input />;
};

Form.Button = function FormButton(props: IFormButtonProps) {
  return <Button {...props} />;
};

Form.Error = function FormError(props: IFormNormalProps) {
  return <Error {...props} />;
};

Form.Success = function FormSuccess(props: IFormNormalProps) {
  return <Success {...props} />;
};

Form.LinkContainer = function FormLinkContainer(props: IFormNormalProps) {
  return <LinkContainer {...props} />;
};
