# Slack-Clone-Project

## 📄 개요

리액트 + 타입스크립트로 구현한 Slack 클론 프로젝트입니다.

## 프로젝트 목표

1. React를 사용하면서 불필요한 렌더링 방지 및 각종 api를 사용해보기
  - useCallback
  - useMemo
  - React.Memo
  - React.lazy, suspense

2. TS, Emotion, SWR과 같은 다양한 기술을 직접 사용하면서 친숙도 올리기

3. 채팅을 구현하면서 사용자 입장에서의 스크롤 UI 구현 시 고민하고, 어려운 부분 경험해보기

## 🛠 기술 스택

  <img src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=React&logoColor=#5bccea"/><img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"/><img src="https://img.shields.io/badge/Socket.IO-18191A?style=for-the-badge&logo=Socket.io&logoColor=white"/><img src="https://img.shields.io/badge/Emotion-D36AC2?style=for-the-badge&logoColor=f776AB"/><img src="https://img.shields.io/badge/SWR-121212?style=for-the-badge&logo=Emotion&logoColor=white"/>

## 🗓 기간

2022/01/19 ~ 2022/01/28 (약 1주일)

## 프로젝트 Wiki

https://github.com/URSound/Slack-Clone-Project/wiki

## 👋🏻 팀 소개

|                                  이정민                                  |                                   박채영                                    |
| :----------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
| <img src="https://avatars.githubusercontent.com/hustle-dev" width="70%"> | <img src="https://avatars.githubusercontent.com/coolchaeyoung" width="70%"> |
|               [hustle-dev](https://github.com/hustle-dev)                |              [coolchaeyoung](https://github.com/coolchaeyoung)              |


## 🚀 실행 방법

필요 환경

1. mySQL이 설치되어 있고 서버가 실행중이어야 함.
2. `.env` 파일에 아래와 같은 설정 필요

```
COOKIE_SECRET=sleactcookie
MYSQL_PASSWORD=(여기에 mysql 비밀번호)
```

### backend

1. backend 폴더 안에서 아래 명령어 실행

```
npm i

⬇️

npx sequelize db:create
npm run dev

⬇️

npx sequelize db:seed:all
npm run dev
```

### frontend

1. frontend 폴더 안에서 아래 명령어 실행

```
npm i
```

2. 실행

```
npm start
```

