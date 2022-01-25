import axios from 'axios';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';
import useInput from 'hooks/useInput';
import { Form, Loading } from 'components';

function LogIn() {
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 10000,
  });

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLogInError(false);
    try {
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        {
          withCredentials: true,
        },
      );
      mutate(data, false);
    } catch (e: any) {
      setLogInError(error.response?.data?.statusCode === 401);
    }
  };

  if (data) {
    return <Navigate replace to="/workspace/sleact/channel/일반" />;
  }

  return data === undefined && error === undefined ? (
    <Loading />
  ) : (
    <div id="container">
      <Form.Header>Slack</Form.Header>
      <Form onSubmit={onSubmit}>
        <Form.Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Form.Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Form.Label>
        <Form.Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Form.Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Form.Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Form.Error>}
        </Form.Label>
        <Form.Button type="submit">로그인</Form.Button>
      </Form>
      <Form.LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </Form.LinkContainer>
    </div>
  );
}

export default LogIn;
