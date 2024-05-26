import { useEffect, useRef } from 'react';
import styles from './Layout.module.css';

type Props = {
    topLeft?: any;
    topRight?: any;
    bottomLeft?: any;
    bottomRight?: any;
    children?: any; // fixed positioned children
};

function Layout(props: Props) {
    const topLeftRef = useRef(null);
    const topRightRef = useRef(null);

    // update TopLeft height when TopRight height is changed
    useEffect(() => {
        const topLeftNode = topLeftRef.current as any;
        const topRightNode = topRightRef.current as any;

        const adjustTopLeftHeight = () => {
            const topRightHeight = topRightNode.offsetHeight;
            topLeftNode.style.height = `${topRightHeight}px`;
        };

        adjustTopLeftHeight();

        const observer = new ResizeObserver(() => {
            adjustTopLeftHeight();
        });

        observer.observe(topRightNode);
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.columns}>
                <div className={styles.column_left}>
                    <div className={styles.top_left} ref={topLeftRef}>
                        {props.topLeft}
                    </div>
                    <div className={styles.bottom_left}>{props.bottomLeft}</div>
                </div>
                <div className={styles.column_right}>
                    <div className={styles.top_right} ref={topRightRef}>
                        {props.topRight}
                    </div>
                    <div className={styles.bottom_right}>{props.bottomRight}</div>
                </div>
            </div>
            {props.children}
        </div>
    );
}

export default Layout;
