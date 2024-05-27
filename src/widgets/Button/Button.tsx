import React, {FC, HTMLProps} from 'react';
import styles from './Button.module.css'
import {appendClassName} from "../../shared/util";

type Props = {
    className?: string;
    children?: any;
    type?: "button" | "submit" | "reset";
} & HTMLProps<HTMLButtonElement>;

const Button: FC<Props> = ({className, children, ...rest}) => {
    return (
        <button className={appendClassName(styles.button, className)} {...rest}>
            {children}
        </button>
    );
};

export default Button;