import { Loading } from 'components';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login/Login'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const Workspace = lazy(() => import('./pages/Workspace/Workspace'));
const Channel = lazy(() => import('./pages/Channel/Channel'));
const DirectMessage = lazy(() => import('./pages/DirectMessage/DirectMessage'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/:workspace" element={<Workspace />}>
          <Route path="/workspace/:workspace/channel/:channel" element={<Channel />} />
          <Route path="/workspace/:workspace/dm/:id" element={<DirectMessage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Suspense>
  );
}
