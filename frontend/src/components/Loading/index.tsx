import React, { useEffect, ReactElement } from 'react';
import { Bars } from 'react-loading-icons';
import { LoadingProps } from './Loading.types';

const loadingStartNode = document.getElementById('loading-start') as HTMLDivElement;
const loadingEndNode = document.getElementById('loading-end') as HTMLDivElement;

export default function Loading({ message }: LoadingProps): ReactElement {
  useEffect(() => {
    loadingStartNode.setAttribute('role', 'alert');
    loadingStartNode.insertAdjacentHTML('beforeend', `<span class="a11yHidden">${message}</span>`);

    return () => {
      loadingStartNode.removeAttribute('role');
      loadingStartNode.innerHTML = '';

      loadingEndNode.insertAdjacentHTML('beforeend', `<span class="a11yHidden">로딩이 종료되었습니다.</span>`);
      setTimeout(() => {
        loadingEndNode.innerHTML = '';
      }, 400);
    };
  }, [message]);

  return (
    <Bars
      height="5rem"
      fill="#00000"
      fillOpacity={0.7}
      //   css={`
      //     position: fixed;
      //     top: 50%;
      //     left: 50%;
      //     transform: translate(-50%, -50%);
      //   `}
    />
  );
}
