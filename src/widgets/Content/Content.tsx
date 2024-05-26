import { appendClassName } from '../../shared/util';
import styles from './Content.module.css';

type Props = {
    children: any;
    className?: string;
};

function Content(props: Props) {
    return <div className={appendClassName(styles.content, props.className)}>{props.children}</div>;
}

export default Content;
