import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'

function NavLink({ to, labelKey, icon, onClick, visible = true, as = 'a' }) {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <li className="nav-item mx-2">
      <Link
        className="nav-link"
        to={to}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        {icon} {t(labelKey)}
      </Link>
    </li>
  );
}

export default NavLink;