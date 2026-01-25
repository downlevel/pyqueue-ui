import React from 'react';
import Breadcrumbs from '../Breadcrumbs';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="app-header">
            <div className="header__left">
                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <Breadcrumbs />
            </div>

            <div className="header__right">
                <div className="header__status">
                    <span className="header__status-dot"></span>
                    <span>Connected</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
