import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';
import gravatar from 'gravatar';
import {
  CreateChannelModal,
  DMList,
  Form,
  InviteChannelModal,
  InviteWorkspaceModal,
  Loading,
  Menu,
  Modal,
} from 'components';
import { IChannel, IUser, IWorkspace } from 'typings/db';
import useInput from 'hooks/useInput';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChannelList from 'components/ChannelList/ChannelList';
import useSocket from 'hooks/useSocket';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './Workspace.styles';

export default function Workspace() {
  const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('/api/users', fetcher);

  const { workspace } = useParams<{ workspace: string }>();
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      socket.emit('login', { id: userData.id, channels: channelData.map((channel) => channel.id) });
    }
  }, [socket, userData, channelData]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidateUser(false, false);
    });
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          // { withCredentials: true },
        )
        .then(() => {
          revalidateUser();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl, revalidateUser, setNewWorkspace, setNewUrl],
  );

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
    setShowWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  if (!userData) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span role="button" tabIndex={0} onClick={onClickUserProfile} onKeyDown={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          </span>
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws: IWorkspace) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            {userData?.Workspaces.find((v) => v.url === workspace)?.name}
          </WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</h2>
                <button type="button" onClick={onClickInviteWorkspace}>
                  워크스페이스에 사용자 초대
                </button>
                <button type="button" onClick={onClickAddChannel}>
                  채널 만들기
                </button>
                <button type="button" onClick={onLogout}>
                  로그아웃
                </button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <ToastContainer />
          <Outlet />
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Form.Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Form.Input
              type="text"
              name="workspace"
              id="workspace"
              value={newWorkspace}
              onChange={onChangeNewWorkspace}
            />
          </Form.Label>
          <Form.Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Form.Input type="text" name="workspace-url" id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Form.Label>
          <Form.Button type="submit">생성하기</Form.Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
}
