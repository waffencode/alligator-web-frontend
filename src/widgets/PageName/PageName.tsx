import styles from './PageName.module.css';

type Props = {
  text: string;
};

function PageName(props: Props) {
  return <div className={styles.name}>{props.text}</div>;
}

export default PageName;
