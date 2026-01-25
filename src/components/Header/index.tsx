import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';

const Header: React.FC = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className="app-header">
            <div className="header__left">
                <Link to="/" className="header__logo">
                    <div className="header__logo-icon">PQ</div>
                    <span className="header__logo-text">PyQueue</span>
                </Link>

                <nav className="header__nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'nav-link--active' : ''}`
                        }
                        end
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `nav-link ${isActive && !isHome ? 'nav-link--active' : ''}`
                        }
                    >
                        Queues
                    </NavLink>
                </nav>

                {!isHome && <Breadcrumbs />}
            </div>

            <div className="header__right">
                <div className="header__status">
                    <span className="header__status-dot"></span>
                    <span>Online</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
