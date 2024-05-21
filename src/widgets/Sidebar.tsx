import React from 'react';
import './Sidebar.css';
import exitIcon from '../shared/ui/icons/exit.png';

interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface SidebarProps {
  menuItems: MenuItem[];
  headerIcon?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, headerIcon }) => {
  const handleLogout = () => {
    const confirmLogout = window.confirm('Вы уверены, что хотите выйти?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {headerIcon && <img src={headerIcon} alt="Header Icon" className="header-icon" />}
        <h2>Аллигатор</h2>
      </div>
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item" onClick={item.onClick}>
            {item.icon && <img src={item.icon} alt={item.label} className="menu-icon" />}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="logout-container">
        <li className="logout-item" onClick={handleLogout}>
          <img src={exitIcon} alt="Logout Icon" className="logout-icon" />
          <span>Выход</span>
        </li>
      </div>
    </div>
  );
};

export default Sidebar;
