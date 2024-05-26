import logo from '../../shared/ui/icons/alligator.png';
import styles from './BrandLogo.module.css';
import alligator from '../../shared/ui/icons/svg/alligator.svg'

type Props = {
  onClick: () => void;
};

function BrandLogo(props: Props) {
  return (
      <div className={styles.logo} onClick={props.onClick}>
          <span>Alligator</span>
          <img src={alligator} alt="Brand Logo" />
      </div>
  )
}

export default BrandLogo;
