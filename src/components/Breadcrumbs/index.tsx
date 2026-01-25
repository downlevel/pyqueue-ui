import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const toTitleCase = (value: string): string =>
    decodeURIComponent(value)
        .split(/[-_]/g)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');

interface BreadcrumbItem {
    label: string;
    path?: string;
}

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const { queueId } = useParams<{ queueId: string }>();

    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const items: BreadcrumbItem[] = [{ label: 'Dashboard', path: '/' }];

        if (location.pathname === '/') {
            return items;
        }

        if (location.pathname.startsWith('/queues/') && queueId) {
            items.push({ label: 'Queues', path: '/' });

            if (location.pathname.endsWith('/messages')) {
                items.push({
                    label: toTitleCase(queueId),
                    path: `/queues/${encodeURIComponent(queueId)}`
                });
                items.push({ label: 'Messages' });
            } else {
                items.push({ label: toTitleCase(queueId) });
            }
        }

        return items;
    };

    const breadcrumbs = getBreadcrumbs();

    if (breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                    <React.Fragment key={`${item.label}-${index}`}>
                        {index > 0 && (
                            <span className="breadcrumb-separator" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </span>
                        )}
                        {isLast || !item.path ? (
                            <span className={`breadcrumb-item ${isLast ? 'breadcrumb-item--active' : ''}`}>
                                {item.label}
                            </span>
                        ) : (
                            <Link to={item.path} className="breadcrumb-item">
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
