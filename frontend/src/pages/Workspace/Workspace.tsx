import axios from 'axios';
import React, { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';

export default function Workspace() {
  const { data: userData, error, mutate: revalidateUser } = useSWR('/api/users', fetcher);

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
      <button type="button" onClick={onLogout}>
        로그아웃
      </button>
    </div>
  );
}
