import React, { useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { IUser } from 'typings/db';
import fetcher from 'utils/fetcher';
import { EachChannelProps } from './EachChannel.types';

export default function EachChannel({ channel }: EachChannelProps) {
  const { workspace } = useParams();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${channel.name}`) {
      mutate(0);
    }
  }, [mutate, location, workspace, channel]);

  return (
    <NavLink
      key={channel.name}
      className={({ isActive }) => (isActive ? 'selected' : '')}
      to={`/workspace/${workspace}/channel/${channel.name}`}
    >
      <span className={count !== undefined && count > 0 ? 'bold' : undefined}># {channel.name}</span>
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLink>
  );
}
