import axios from 'axios';
import useInput from 'hooks/useInput';
import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { IDM } from 'typings/db';
import fetcher from 'utils/fetcher';
import gravatar from 'gravatar';
import { ChatBox, ChatList } from 'components';
import { Container, Header } from './DirectMessage.styles';

export default function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`http://localhost:3095/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `http://localhost:3095//api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = async (e: SubmitEvent) => {
    if (chat?.trim()) {
      e.preventDefault();
      try {
        await axios.post(
          `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`,
          {
            content: chat,
          },
          { withCredentials: true },
        );
        setChat('');
      } catch (e: any) {
        console.error(e);
      }
    }
  };

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}
