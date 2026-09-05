const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, env.MOBILE_URL, 'http://localhost:19006', 'http://localhost:8081'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', limiter);

app.get('/health', (req, res) => res.json({ status: 'ok', env: env.NODE_ENV }));
app.get('/', (req, res) =>
  res.json({ success: true, message: 'AI Artisan Marketplace API is running', docs: '/api' })
);
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
