# PyQueue UI

A web interface for managing PyQueue Server queues, messages, and monitoring.

## Features

- 📊 Real-time queue monitoring and statistics
- 📝 Message viewer with search and filtering
- 🎯 Queue management actions
- 🔄 Live updates and auto-refresh
- 🎨 Clean, intuitive UI similar to Kafka-UI

## Prerequisites

- Node.js 18+ and npm
- PyQueue Server running (backend API)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
VITE_UI_PORT=3000
VITE_API_HOST=localhost
VITE_API_PORT=8000
VITE_API_URL=http://localhost:8000
# Optional: API key header
VITE_API_KEY=
```

## Development

```bash
# Start development server
npm run dev
```

By default Vite serves at `http://localhost:5173`; use `npm run dev -- --host --port 3000` if you prefer a custom port.

## Building for Production

```bash
# Create optimized production build
npm run build
```

## Docker Deployment

### Using Docker Compose (Recommended)

From the parent directory containing both `pyqueue-server` and `pyqueue-ui`:

```bash
# Build and start both services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Standalone Docker Build

```bash
# Build the image
docker build -t pyqueue-ui .

# Run the container
docker run -p 3000:80 -e VITE_API_URL=http://localhost:8000 pyqueue-ui
```

## Project Structure

```
pyqueue-ui/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── QueueList/          # Queue listing view
│   │   ├── QueueDetails/       # Queue detail view
│   │   ├── MessageViewer/      # Message browsing
│   ├── services/        # API clients
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Helper functions
│   └── styles/          # Global styles
├── Dockerfile           # Docker build config
├── nginx.conf           # Nginx configuration
└── package.json         # Dependencies
```

## API Integration

The UI connects to PyQueue Server API endpoints:

- `GET /queues` - List all queues
- `GET /queues/{name}` - Get queue details
- `POST /queues/{name}/messages` - Add message
- `GET /queues/{name}/messages` - Retrieve messages
- `DELETE /queues/{name}` - Delete queue
- `GET /health` - Server health check

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_UI_PORT` | Dev server port override | 3000 |
| `VITE_API_HOST` | API server hostname | localhost |
| `VITE_API_PORT` | API server port | 8000 |
| `VITE_API_URL` | Full API base URL | http://localhost:8000 |
| `VITE_API_KEY` | Optional API key sent as `x-api-key` | *(unset)* |

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Router** - Navigation
- **Nginx** - Production web server

## License

MIT License - See parent project for details