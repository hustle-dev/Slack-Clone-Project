import axios from 'axios';
import { Modal, Form } from 'components';
import useInput from 'hooks/useInput';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel, IUser } from 'typings/db';
import fetcher from 'utils/fetcher';
import { CreateChannelModalProps } from './CreateChannelModal.types';

export default function CreateChannelModal({ show, onCloseModal, setShowCreateChannelModal }: CreateChannelModalProps) {
  const params = useParams<{ workspace?: string }>();
  const { workspace } = params;
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e) => {
      if (!newChannel || !newChannel.trim()) return;

      e.preventDefault();

      axios
        .post(`/api/workspaces/${workspace}/channels`, {
          name: newChannel,
        })
        .then(() => {
          revalidateChannel();
          setShowCreateChannelModal(false);
          setNewChannel('');
          onCloseModal();
        })
        .catch((error) => {
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel, revalidateChannel, setNewChannel, setShowCreateChannelModal, workspace, onCloseModal],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Form.Label id="channel-label">
          <span>채널 이름</span>
          <Form.Input type="text" name="channel" id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Form.Label>
        <Form.Button type="submit">생성하기</Form.Button>
      </form>
    </Modal>
  );
}
