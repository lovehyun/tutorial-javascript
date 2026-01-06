/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

// css 헬퍼를 사용한 스타일 정의
const buttonStyle = css`
  background-color: white;
  color: blue;
  border: 2px solid blue;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: lightblue;
  }
`;

// styled를 사용한 동적 스타일
const DynamicButton = styled.button`
  background-color: ${(props) => (props.primary ? 'blue' : 'white')};
  color: ${(props) => (props.primary ? 'white' : 'blue')};
  border: 2px solid blue;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.primary ? 'darkblue' : 'lightblue')};
  }
`;

const App = () => {
  return (
    <div>
      <button css={buttonStyle}>Default Button</button>
      <DynamicButton primary>Primary Button</DynamicButton>
    </div>
  );
};

export default App;
