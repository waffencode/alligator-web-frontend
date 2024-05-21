import React, { useState } from 'react';
import './Sidebar.css';
import exitIcon from '../shared/ui/icons/exit.png';

interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  subItems?: { label: string; onClick: () => void }[]; // Each subItem now has its own label and onClick
}

interface SidebarProps {
  menuItems: MenuItem[];
  headerIcon?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, headerIcon }) => {
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

  const handleLogout = () => {
    const confirmLogout = window.confirm('Вы уверены, что хотите выйти?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const toggleItem = (index: number) => {
    setOpenItems(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {headerIcon && <img src={headerIcon} alt="Header Icon" className="header-icon" />}
        <h2>Alligator</h2>
      </div>
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <div onClick={() => toggleItem(index)}>
              {item.icon && <img src={item.icon} alt={item.label} className="menu-icon" />}
              <span>{item.label}</span>
            </div>
            {item.subItems && openItems[index] && (
              <ul className="submenu-list">
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex} className="submenu-item" onClick={subItem.onClick}>
                    {subItem.label}
                  </li>
                ))}
              </ul>
            )}
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
