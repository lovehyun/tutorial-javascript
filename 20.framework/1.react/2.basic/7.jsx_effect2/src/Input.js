import React from "react";

const Input = ({ setMessage }) => {
    return (
        <div>
            <label>Enter a message: </label>
            <input
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type here..."
            />
        </div>
    );
};

export default Input;
