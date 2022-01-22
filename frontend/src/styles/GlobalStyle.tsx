import React from 'react';
import { Global, css } from '@emotion/react';
import emotionNormalize from 'emotion-normalize';

const style = css`
  ${emotionNormalize}
  html,
      body {
    margin: 0;
    padding: 0;
    overflow: initial !important;
  }
  body {
    font-size: 15px;
    line-height: 1.46668;
    font-weight: 400;
    font-variant-ligatures: common-ligatures;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }
  * {
    box-sizing: border-box;
  }

  .a11yHidden {
    overflow: hidden;
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: circle(0);
    width: 1px;
    height: 1px;
    margin: -1px;
    white-space: nowrap;
  }
`;

export default function GlobalStyle() {
  return <Global styles={style} />;
}
