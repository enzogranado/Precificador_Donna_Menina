import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

// Carregar variáveis de ambiente
dotenv.config();

const port = process.env.PORT || 3001;
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  console.error('❌ ERRO CRÍTICO: Variável de ambiente MONGODB_URI não foi configurada!');
  process.exit(1);
}

// Conectar ao MongoDB Atlas
console.log('🔌 Conectando ao MongoDB Atlas...');
mongoose.connect(mongodbUri)
  .then(() => {
    console.log('🔌 Conectado com sucesso ao MongoDB Atlas!');
    // Iniciar o servidor após conectar ao banco de dados com sucesso
    app.listen(port, () => {
      console.log(`🚀 Servidor Donna Menina rodando em http://localhost:${port}`);
      console.log(`📌 Rotas da API montadas sob http://localhost:${port}/api`);
    });
  })
  .catch((err: any) => {
    console.error('❌ Erro crítico ao conectar ao MongoDB Atlas:', err.message);
    process.exit(1);
  });
