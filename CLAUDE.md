# CLAUDE.md - AI Assistant Guide for PyQueue UI

## Project Overview

PyQueue UI is a React-based web dashboard for managing PyQueue Server queues. It provides real-time queue monitoring, message browsing, and queue management capabilities through a clean, modern interface.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.3.3 | Type safety |
| Vite | 5.2.0 | Build tool and dev server |
| React Router | 6.22.0 | Client-side routing |
| TanStack React Query | 5.29.0 | Data fetching and caching |
| Axios | 1.6.8 | HTTP client |
| Nginx | Alpine | Production server (Docker) |

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Type checking
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview

# Docker build
docker build -t pyqueue-ui .

# Docker run
docker run -p 3000:80 pyqueue-ui
```

## Project Structure

```
pyqueue-ui/
├── src/
│   ├── components/           # React components (folder-per-component)
│   │   ├── QueueList/        # Queue listing with overview stats
│   │   ├── QueueDetails/     # Individual queue view
│   │   └── MessageViewer/    # Paginated message browser
│   ├── services/
│   │   └── queueService.ts   # API client with data normalization
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── helpers.ts        # Utility functions
│   ├── styles/
│   │   └── index.css         # Global CSS styles
│   ├── App.tsx               # Root component with routing
│   └── main.tsx              # Application entry point
├── public/                   # Static assets
├── dist/                     # Production build output
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
├── nginx.conf                # Production server config
├── Dockerfile                # Multi-stage Docker build
└── docker-compose.yml        # Container orchestration
```

## Code Conventions

### Component Patterns

- **Folder-per-component**: Each component lives in its own folder with an `index.tsx` file
- **Functional components**: Use `React.FC` typing for all components
- **React Query**: Use `useQuery` hook for data fetching with typed generics

```tsx
// Example component pattern
const MyComponent: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery<DataType, Error>({
        queryKey: ['key'],
        queryFn: fetchFunction
    });

    if (isLoading) return <div className="status-card">Loading...</div>;
    if (isError) return <div className="status-card error">{error.message}</div>;

    return <div>...</div>;
};

export default MyComponent;
```

### TypeScript Conventions

- **Strict mode enabled**: All strict checks are active
- **Type imports**: Use `import type { ... }` for type-only imports
- **Interface naming**: Use PascalCase without `I` prefix (e.g., `Queue`, not `IQueue`)
- **Target**: ESNext with react-jsx preset

### API Service Patterns

The `queueService.ts` uses a robust normalization layer:

- **Dual case support**: Handles both `snake_case` and `camelCase` API responses
- **Envelope extraction**: Automatically unwraps `{ queues: [...] }`, `{ messages: [...] }`, etc.
- **Type-safe conversions**: `toNumber()`, `toStringValue()`, `toStringArray()` helpers
- **Error handling**: Axios error extraction with fallback messages

```ts
// Example service function pattern
export const getQueues = async (): Promise<QueueCollection> => {
    const payload = await request<unknown>({ method: 'GET', url: '/queues' });
    return normaliseQueuesPayload(payload);
};
```

### CSS Conventions

- **BEM-like naming**: `.component__element--modifier` pattern
- **CSS variables**: Colors defined as CSS custom properties
- **No CSS frameworks**: Pure CSS with custom design system
- **Responsive breakpoint**: 768px for mobile layouts

```css
/* Example class naming */
.queue-card { }
.queue-card__header { }
.queue-card__stats { }
.queue-capacity__segment--available { }
```

## Key Types

```ts
interface Queue {
    id: string;
    queueName: string;
    messageCount: number;
    availableMessages: number;
    inFlightMessages: number;
    permissions: string[];
}

interface Message {
    id: string;
    timestamp: string;
    status?: string;
    visibilityTimeout?: string | null;
    receiptHandle?: string | null;
    receiveCount?: number;
    messageBody: unknown;
    queueId?: string;
    raw?: Record<string, unknown>;
}

interface MessagePage {
    messages: Message[];
    count: number;
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}
```

## API Endpoints

The UI connects to PyQueue Server at `VITE_API_URL` (default: `/api` proxied to `http://localhost:8000`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/queues` | List all queues |
| GET | `/queues/{id}/info` | Get queue details |
| GET | `/queues/{id}/messages` | Get messages (supports `limit`, `offset` params) |
| POST | `/queues` | Create new queue |
| DELETE | `/queues/{id}` | Delete queue |

### API Authentication

Optional API key via `VITE_API_KEY` environment variable, sent as `x-api-key` header.

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | QueueList | Main queue listing |
| `/queues/:queueId` | QueueDetails | Single queue details |
| `/queues/:queueId/messages` | MessageViewer | Paginated message browser |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `/api` (proxied in dev) |
| `VITE_API_KEY` | Optional API key | unset |
| `VITE_DEV_PROXY_TARGET` | Dev proxy target | `http://localhost:8000` |

## Development Notes

### Vite Dev Server

- Runs on port 3000 by default
- Proxies `/api` requests to PyQueue Server
- Hot module replacement enabled

### Building for Production

- Multi-stage Docker build (Node 18-Alpine -> Nginx-Alpine)
- Source maps enabled in production
- Nginx configured with:
  - Gzip compression
  - Security headers (X-Frame-Options, X-Content-Type-Options)
  - Cache control for static assets
  - SPA fallback routing

### No Testing Framework

Currently no test framework is configured. When adding tests:
- Consider Vitest (Vite-native) for unit tests
- React Testing Library for component tests

## Common Tasks

### Adding a New Component

1. Create folder under `src/components/ComponentName/`
2. Add `index.tsx` with the component
3. Use React Query for data fetching
4. Follow existing patterns for loading/error states

### Adding API Functions

1. Add function to `src/services/queueService.ts`
2. Create appropriate normalizer if API response format varies
3. Export typed response interface in `src/types/index.ts`

### Modifying Styles

1. Add CSS to `src/styles/index.css`
2. Use BEM naming convention
3. Consider mobile responsiveness (768px breakpoint)

## Gotchas

1. **API Response Normalization**: The service layer handles multiple API response formats - don't assume consistent casing from the backend
2. **URL Encoding**: Queue IDs are URL-encoded in routes (`encodeURIComponent`)
3. **Pagination**: Messages endpoint uses `offset`/`limit` parameters
4. **React Query Keys**: Ensure unique query keys for proper cache invalidation
5. **No ESLint/Prettier**: Project doesn't have linting configured - follow existing code style

## File Locations Reference

- **Main entry**: `src/main.tsx`
- **Root component**: `src/App.tsx`
- **API client**: `src/services/queueService.ts`
- **Type definitions**: `src/types/index.ts`
- **Utilities**: `src/utils/helpers.ts`
- **Global styles**: `src/styles/index.css`
- **Build config**: `vite.config.ts`
- **TS config**: `tsconfig.json`
- **Docker config**: `Dockerfile`, `nginx.conf`
