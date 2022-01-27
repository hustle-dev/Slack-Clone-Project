import axios from 'axios';
import { Modal, Form } from 'components';
import useInput from 'hooks/useInput';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IUser } from 'typings/db';
import fetcher from 'utils/fetcher';
import { InviteWorkspaceModalProps } from './InviteWorkspaceModal.types';

export default function InviteWorkspaceModal({
  show,
  onCloseModal,
  setShowInviteWorkspaceModal,
}: InviteWorkspaceModalProps) {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate: revalidateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;

      axios
        .post(`/api/workspaces/${workspace}/members`, {
          email: newMember,
        })
        .then(() => {
          revalidateMember();
          setShowInviteWorkspaceModal(false);
          setNewMember('');
          onCloseModal();
        })
        .catch((error) => {
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember, workspace, revalidateMember, setShowInviteWorkspaceModal, setNewMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Form.Label id="member-label">
          <span>이메일</span>
          <Form.Input name="member" id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Form.Label>
        <Form.Button type="submit">초대하기</Form.Button>
      </form>
    </Modal>
  );
}
