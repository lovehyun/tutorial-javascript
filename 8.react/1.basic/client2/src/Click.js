import React from 'react';

function Click({ onButtonClick, onResetClick }) {
    return (
        <div>
            <button onClick={onButtonClick}>
                Click me
            </button>
            <button onClick={onResetClick}>
                Reset
            </button>
        </div>
    );
}

export default Click;
