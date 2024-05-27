import React, {FC, HTMLProps} from 'react';
import styles from './Modal.module.css'

type Props = {
    name?: string
    children?: any
    closeCallback: () => void
} & HTMLProps<HTMLDivElement>

const Modal: FC<Props> = ({name, closeCallback, children, ...rest}) => {
    return (
        <div className={styles.modal_background} onClick={closeCallback}>
            <div className={styles.modal} {...rest}
                 onClick={e => e.stopPropagation()}
            >
                <div className={styles.headline}>{name}</div>
                {children}
            </div>
        </div>
    );
};

export default Modal;