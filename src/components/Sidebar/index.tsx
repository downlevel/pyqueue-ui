import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQueues } from '../../services/queueService';
import type { QueueCollection } from '../../types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    const { data } = useQuery<QueueCollection, Error>({
        queryKey: ['queues'],
        queryFn: getQueues,
        staleTime: 30_000
    });

    const queueCount = data?.count ?? data?.queues.length ?? 0;
    const totalMessages = data?.queues.reduce((sum, q) => sum + q.messageCount, 0) ?? 0;

    const handleBackdropClick = () => {
        onClose();
    };

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={handleBackdropClick}
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 99,
                        display: 'none'
                    }}
                />
            )}

            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar__header">
                    <NavLink to="/" className="sidebar__logo" onClick={onClose}>
                        <div className="sidebar__logo-icon">PQ</div>
                        <span className="sidebar__logo-text">PyQueue</span>
                    </NavLink>
                </div>

                <nav className="sidebar__nav">
                    <div className="nav-section">
                        <div className="nav-section__title">Main Menu</div>
                        <NavLink
                            to="/"
                            className={`nav-item ${isActive('/') && location.pathname === '/' ? 'nav-item--active' : ''}`}
                            onClick={onClose}
                            end
                        >
                            <span className="nav-item__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                            </span>
                            <span>Dashboard</span>
                            {queueCount > 0 && (
                                <span className="nav-item__badge">{queueCount}</span>
                            )}
                        </NavLink>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section__title">Queue Management</div>
                        <NavLink
                            to="/"
                            className={`nav-item ${isActive('/queues') ? 'nav-item--active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-item__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                            </span>
                            <span>All Queues</span>
                        </NavLink>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section__title">Statistics</div>
                        <div className="sidebar-stats">
                            <div className="sidebar-stat">
                                <div className="sidebar-stat__icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                                <div className="sidebar-stat__content">
                                    <span className="sidebar-stat__value">{queueCount}</span>
                                    <span className="sidebar-stat__label">Active Queues</span>
                                </div>
                            </div>
                            <div className="sidebar-stat">
                                <div className="sidebar-stat__icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div className="sidebar-stat__content">
                                    <span className="sidebar-stat__value">{totalMessages}</span>
                                    <span className="sidebar-stat__label">Total Messages</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="sidebar__footer">
                    <div className="sidebar-info">
                        <div className="sidebar-info__status">
                            <span className="sidebar-info__dot"></span>
                            <span>Connected</span>
                        </div>
                        <span className="sidebar-info__version">v1.0.0</span>
                    </div>
                </div>
            </aside>

            <style>{`
                .sidebar-backdrop {
                    display: none !important;
                }

                @media (max-width: 1024px) {
                    .sidebar-backdrop {
                        display: block !important;
                    }
                }

                .sidebar-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 0 8px;
                }

                .sidebar-stat {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: var(--color-bg-tertiary);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--color-border);
                }

                .sidebar-stat__icon {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-primary-subtle);
                    color: var(--color-primary);
                    border-radius: var(--radius-sm);
                }

                .sidebar-stat__content {
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-stat__value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                    line-height: 1.2;
                }

                .sidebar-stat__label {
                    font-size: 0.7rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .sidebar-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background: var(--color-bg-tertiary);
                    border-radius: var(--radius-md);
                }

                .sidebar-info__status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    color: var(--color-success);
                    font-weight: 500;
                }

                .sidebar-info__dot {
                    width: 8px;
                    height: 8px;
                    background: var(--color-success);
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .sidebar-info__version {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    font-family: var(--font-mono);
                }
            `}</style>
        </>
    );
};

export default Sidebar;
