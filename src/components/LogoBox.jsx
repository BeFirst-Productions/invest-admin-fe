import { Link } from 'react-router-dom';
import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import logoSm from '@/assets/images/logo-sm.png';
const LogoBox = ({
  containerClassName,
  squareLogo,
  textLogo, style
}) => {
  return <div className={containerClassName ?? ''}  >
    <Link to="/" className="logo-dark">
      {/* <img
    src="/ADL- D.png"
    style={{
          width: 50,
      height: 50,
      objectFit: "fit",
    }}
    alt="logo sm"
  /> */}
      <img
        src="/logo-white.png"
        style={{
          width: 200,
          height: 200,
          objectFit: "contain",
        }}
        alt="logo dark"
      />
    </Link>

    <Link to="/" className="logo-light">
      {/* <img
    src="/ADL- D.png"
    style={{
      width: 50,
      height: 50,
      objectFit: "fit",
    }}
    alt="logo sm"
  /> */}
      <img
        src="/logo.png"
        style={{
          width: 170,
          height: 170,
          objectFit: "contain",
        }}
        alt="logo light"
      />
    </Link>
  </div>;
};
export default LogoBox;