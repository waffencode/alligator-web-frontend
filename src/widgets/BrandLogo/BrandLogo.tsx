import { useNavigate } from 'react-router-dom';
import _BrandLogo from './template';
import { RoutePaths } from '../../shared/config/routes';

const BrandLogo = () => {
  const navigate = useNavigate();

  function _toHome() {
    navigate(RoutePaths.profile);
  }

  return <_BrandLogo onClick={_toHome} />;
};

export default BrandLogo;
