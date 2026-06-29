import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import subscriptionRoutes from './routes/subscriptions.js';
import trendRoutes from './routes/trending.js';
import waitlistRoutes from './routes/waitlist.js';

dotenv.config();
dotenv.config({ path: '.env.production', override: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());

// Webhook needs raw body - must be before express.json()
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/trending', trendRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api', subscriptionRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    hasTursoDbUrl: !!process.env.TURSO_DATABASE_URL,
    hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
    hasTeamDbUrl: !!process.env.TEAM_DB_URL,
    hasTeamDbToken: !!process.env.TEAM_DB_AUTH_TOKEN,
    hasOpenAiKey: !!process.env.OPENAI_API_KEY,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
