import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './middleware/logger';
import { errorHandlerMiddleware } from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Rotas da API montadas sob /api
app.use('/api', apiRoutes);

// Tratador de Erros Global (sempre após as rotas)
app.use(errorHandlerMiddleware);

export default app;
