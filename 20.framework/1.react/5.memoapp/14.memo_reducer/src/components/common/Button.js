import React from 'react';
import styles from './Button.module.css'; // 모듈 CSS 활용

const Button = ({ onClick, children, className, ...props }) => {
    return (
        <button onClick={onClick} className={`${styles.button} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
