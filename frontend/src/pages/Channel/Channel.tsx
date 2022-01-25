import { ChatBox, ChatList } from 'components';
import useInput from 'hooks/useInput';
import React, { useCallback } from 'react';
import { Container, Header } from './Channel.styles';

export default function Channel() {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log('submit');
      setChat('');
    },
    [chat],
  );

  return (
    <Container>
      <Header>채널!</Header>
      {/* <ChatList /> */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}
