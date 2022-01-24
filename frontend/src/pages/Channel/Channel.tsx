import { ChatBox, ChatList } from 'components';
import useInput from 'hooks/useInput';
import React from 'react';
import { Container, Header } from './Channel.styles';

export default function Channel() {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = (e: any) => {
    e.preventDefault();
    console.log('submit');
    setChat('');
  };

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}
