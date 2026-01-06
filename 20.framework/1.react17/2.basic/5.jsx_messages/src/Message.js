import React from 'react';

const Message = ({ count, message }) => {
    return (
        <div>
          <h3>Message: {message}</h3>
          {count > 10 && <p>You've clicked more than 10 times!</p>}
        </div>
      );
};

export default Message;
