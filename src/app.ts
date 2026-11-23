import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';
import { appRoutes } from './routes';

// configurações do express

const app = express();

app.use(cors());
app.use(express.json());

// configuração da documentacao swagge
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// adiciona prefixo /api nas rotas
app.use('/api', appRoutes);

// rota de health check básica
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    mensagem: 'Servidor rodando com sucesso.',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    versao: '1.1.0',
  });
});

export default app;
