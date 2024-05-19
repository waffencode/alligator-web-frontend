import React from 'react';
import './Sidebar.css';

interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {

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
      <ul className="logout-container">
        <li className="menu-item" onClick={handleLogout}>
          <span>Выход</span>
        </li>
      </ul>

    </div>
  );
};

export default Sidebar;