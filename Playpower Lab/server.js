import http from 'http';
import app from './app/app.js';

const PORT = process.env.PORT || 6000;
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Quiz service running on http://localhost:${PORT}`));
