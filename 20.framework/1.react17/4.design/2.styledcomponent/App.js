import React from 'react';
import styled from 'styled-components';

// 스타일 정의
const Button = styled.button`
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

// 컴포넌트 사용
const App = () => {
  return (
    <div>
      <Button primary>Primary Button</Button>
      <Button>Default Button</Button>
    </div>
  );
};

export default App;
