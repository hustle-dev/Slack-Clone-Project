import axios from 'axios';
import { Modal, Form } from 'components';
import useInput from 'hooks/useInput';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IUser } from 'typings/db';
import fetcher from 'utils/fetcher';
import { InviteChannelModalProps } from './InviteChannelModal.types';

export default function InviteChannelModal({ show, onCloseModal, setShowInviteChannelModal }: InviteChannelModalProps) {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate: revalidateMembers } = useSWR<IUser[]>(
    userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;

      axios
        .post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
          email: newMember,
        })
        .then(() => {
          revalidateMembers();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember, workspace, channel, revalidateMembers, setShowInviteChannelModal, setNewMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Form.Label id="member-label">
          <span>채널 멤버 초대</span>
          <Form.Input type="text" name="member" id="member" value={newMember} onChange={onChangeNewMember} />
        </Form.Label>
        <Form.Button type="submit">초대하기</Form.Button>
      </form>
    </Modal>
  );
}
