import axios from 'axios';
import { Form } from 'components';
import useInput from 'hooks/useInput';
import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';

export default function SignUp() {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setMismatchError(e.target.value !== passwordCheck);
  };

  const onChangePasswordCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
    setMismatchError(e.target.value !== password);
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!mismatchError && nickname) {
      setSignUpError('');
      setSignUpSuccess(false);
      try {
        await axios.post('/api/users', { email, nickname, password });
        setSignUpSuccess(true);
      } catch (e: any) {
        setSignUpError(e.message);
      }
    }
  };

  if (data === undefined && error === undefined) {
    return <div>로딩 중...</div>;
  }

  if (data) {
    return <Navigate replace to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Form.Header>Slack</Form.Header>
      <Form onSubmit={onSubmit}>
        <Form.Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Form.Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Form.Label>
        <Form.Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Form.Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Form.Label>
        <Form.Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Form.Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Form.Label>
        <Form.Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Form.Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Form.Error>비밀번호가 일치하지 않습니다.</Form.Error>}
          {!nickname && <Form.Error>닉네임을 입력해주세요.</Form.Error>}
          {signUpError && <Form.Error>이미 가입된 이메일입니다.</Form.Error>}
          {signUpSuccess && <Form.Success>회원가입되었습니다! 로그인해주세요.</Form.Success>}
        </Form.Label>
        <Form.Button type="submit">회원가입</Form.Button>
      </Form>
      <Form.LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </Form.LinkContainer>
    </div>
  );
}
