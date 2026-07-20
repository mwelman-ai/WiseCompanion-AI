import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Serve local static uploads (mock/fallback file storage)
app.use('/uploads', express.static(path.resolve('public/uploads')));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'WiseCompanion AI API is running' });
});

// Start Server (only when run directly, not as Vercel serverless function)
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
