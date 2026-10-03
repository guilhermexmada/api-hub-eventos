import 'dotenv/config';
import { sequelize } from './config/database';
import app from './app';

const PORT = Number(process.env.PORT ?? 3000);

async function iniciarServidor(): Promise<void> {
  try {
    await sequelize.authenticate(); // tenta conectar com o banco postgres local
    console.log('Conexão com o PostgreSQL estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}/api`);
      console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (erro) {
    console.error('Erro ao conectar com o banco de dados:', erro);
    process.exit(1);
  }
}

iniciarServidor();
