import express, {} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
// Routes
app.use('/api', apiRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'WiseCompanion AI API is running' });
});
// Start Server (only when run directly, not as Vercel serverless function)
if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}
export default app;
//# sourceMappingURL=index.js.map