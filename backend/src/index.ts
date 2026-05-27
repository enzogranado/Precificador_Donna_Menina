import dotenv from 'dotenv';
import app from './app';

// Carregar variáveis de ambiente
dotenv.config();

const port = process.env.PORT || 3001;

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor Donna Menina rodando em http://localhost:${port}`);
  console.log(`📌 Rotas da API montadas sob http://localhost:${port}/api`);
});
