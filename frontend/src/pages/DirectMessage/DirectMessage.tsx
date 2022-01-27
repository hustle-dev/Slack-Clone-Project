import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useInput from 'hooks/useInput';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { IDM } from 'typings/db';
import fetcher from 'utils/fetcher';
import gravatar from 'gravatar';
import { ChatBox, ChatList } from 'components';
import makeSection from 'utils/makeSection';
import useSocket from 'hooks/useSocket';
import Scrollbars from 'react-custom-scrollbars';
import { toast } from 'react-toastify';
import { Container, DragOver, Header } from './DirectMessage.styles';

export default function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
    {
      // onSuccess(data) {
      //   if (data?.length === 1) {
      //     setTimeout(() => {
      //       scrollbarRef.current?.scrollToBottom();
      //     }, 100);
      //   }
      // },
    },
  );

  const [socket] = useSocket(workspace);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingENd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const isEndScrollRef = useRef(false);

  const [dragOver, setDragOver] = useState(false);
  const dragTarget = useRef(null);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(
            `/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .then(() => {
            mutateChat();
            setChat('');
            scrollbarRef.current?.scrollToBottom();
          })
          // .then(() => {
          //   mutateChat();
          // })
          .catch(console.error);
      }
    },
    [chat, chatData, myData, userData, workspace, id, setChat, mutateChat],
  );

  const onMessage = useCallback(
    (data: IDM) => {
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        if (
          scrollbarRef.current &&
          scrollbarRef.current.getScrollHeight() ===
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop()
        ) {
          isEndScrollRef.current = true;
        } else {
          isEndScrollRef.current = false;
        }
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }).then(() => {
          // if (scrollbarRef.current) {
          //   if (
          //     scrollbarRef.current.getScrollHeight() <
          //     scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          //   ) {
          //     setTimeout(() => {
          //       scrollbarRef.current?.scrollToBottom();
          //     }, 50);
          //   } else {
          // toast.success('새 메시지가 도착했습니다.', {
          //   onClick() {
          //     scrollbarRef.current?.scrollToBottom();
          //   },
          //   closeOnClick: true,
          // });
          //   }
          // }
          if (isEndScrollRef.current) {
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          } else {
            toast.success('새 메시지가 도착했습니다.', {
              onClick() {
                scrollbarRef.current?.scrollToBottom();
              },
              closeOnClick: true,
            });
          }
        });
      }
    },
    [id, mutateChat, myData],
  );

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
  }, [workspace, id]);

  useEffect(() => {
    setTimeout(() => {
      scrollbarRef.current?.scrollToBottom();
    }, 300);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const formData = new FormData();
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            formData.append('image', file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        setDragOver(false);
        localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
        mutateChat();
        scrollbarRef.current?.scrollToBottom();
      });
    },
    [workspace, id, mutateChat],
  );
  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    dragTarget.current = e.target;
    setDragOver(true);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onDragLeave = useCallback((e) => {
    if (dragTarget.current === e.target) {
      e.preventDefault();
      setDragOver(false);
    }
  }, []);

  if (!userData || !myData) return null;

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container onDrop={onDrop} onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingENd}
      />
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message ${userData.nickname}`}
        onSubmitForm={onSubmitForm}
      />
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
}
