# PyQueue UI

A web interface for managing PyQueue Server queues, messages, and monitoring.

## Features

- 📊 Real-time queue monitoring and statistics
- 📝 Message viewer with search and filtering
- 🎯 Topic/Queue management
- 👥 Consumer group tracking
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
REACT_APP_UI_PORT=3000
REACT_APP_API_HOST=localhost
REACT_APP_API_PORT=8000
REACT_APP_API_URL=http://localhost:8000
```

## Development

```bash
# Start development server
npm start
```

The app will open at `http://localhost:3000`

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
docker run -p 3000:80 -e REACT_APP_API_URL=http://localhost:8000 pyqueue-ui
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
│   │   ├── TopicManager/       # Topic/queue management
│   │   └── ConsumerGroups/     # Consumer group info
│   ├── services/        # API clients
│   ├── hooks/           # Custom React hooks
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
| `REACT_APP_UI_PORT` | UI development port | 3000 |
| `REACT_APP_API_HOST` | API server hostname | localhost |
| `REACT_APP_API_PORT` | API server port | 8000 |
| `REACT_APP_API_URL` | Full API URL | http://localhost:8000 |

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Router** - Navigation
- **Nginx** - Production web server

## License

MIT License - See parent project for details

- Consumer group management

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd pyqueue-ui
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

### Building for Production
To create a production build, run:
```
npm run build
```
This will generate a `build` directory with the optimized application.

## Folder Structure
- `public/`: Contains static files like `index.html` and `manifest.json`.
- `src/`: Contains the source code for the application, including components, services, hooks, and styles.
- `package.json`: Configuration file for npm.
- `tsconfig.json`: TypeScript configuration file.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.