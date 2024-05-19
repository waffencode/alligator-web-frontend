import React from 'react';
import './Sidebar.css';

interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface SidebarProps {
  menuItems: MenuItem[];
  headerIcon?: string; // Сделаем свойство необязательным
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, headerIcon }) => {
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
    </div>
  );
};

export default Sidebar;
