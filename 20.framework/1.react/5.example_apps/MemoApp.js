import React, { useState } from 'react';

const MemoApp = () => {
  const [memoList, setMemoList] = useState([]);
  const [newMemo, setNewMemo] = useState('');

  const addMemo = () => {
    if (newMemo.trim() !== '') {
      setMemoList([...memoList, newMemo]);
      setNewMemo('');
    }
  };

  const deleteMemo = (index) => {
    const updatedMemoList = [...memoList];
    updatedMemoList.splice(index, 1);
    setMemoList(updatedMemoList);
  };

  return (
    <div>
      <h1>간단한 메모장</h1>
      <div>
        <input
          type="text"
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          placeholder="메모를 입력하세요"
        />
        <button onClick={addMemo}>추가</button>
      </div>

      {/* <ul>
      {
        (() => {
          const memoElements = [];
          for (let index = 0; index < memoList.length; index++) {
            const memo = memoList[index];
            memoElements.push(
              <li key={index}>
                {memo}
                <button onClick={() => deleteMemo(index)}>삭제</button>
              </li>
            );
          }
          return memoElements;
        })()
      }
      </ul> */}

      <ul>
        {memoList.map((memo, index) => (
          <li key={index}>
            {memo}
            <button onClick={() => deleteMemo(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoApp;
