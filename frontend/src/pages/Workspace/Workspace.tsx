import axios from 'axios';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';
import gravatar from 'gravatar';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './Workspace.styles';

export default function Workspace() {
  const {
    data: userData,
    error,
    mutate: revalidateUser,
  } = useSWR('/api/users', fetcher, {
    dedupingInterval: 10000,
  });

  const onLogout = async () => {
    try {
      await axios.post('/api/users/logout', null, {
        withCredentials: true,
      });
      revalidateUser();
    } catch (e: any) {
      console.error(e);
    }
  };

  if (!userData) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Slack</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Outlet />
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
}
