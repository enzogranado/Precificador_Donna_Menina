import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';
import app from './app';
import User from './models/User';
import crypto from 'crypto';

// Configurar DNS para usar Google DNS (resolve problemas com redes móveis)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Carregar variáveis de ambiente
dotenv.config();

const port = process.env.PORT || 3001;
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  console.error('❌ ERRO CRÍTICO: Variável de ambiente MONGODB_URI não foi configurada!');
  process.exit(1);
}

async function seedAdminUser() {
  try {
    const email = 'citt@gmail.com';
    const rawPassword = '123';
    const hashedPassword = crypto.createHash('sha256').update(rawPassword).digest('hex');

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUser = new User({
        email,
        password: hashedPassword
      });
      await newUser.save();
      console.log(`🌱 Seeding: Usuário ${email} criado com sucesso!`);
    } else {
      console.log(`🌱 Seeding: Usuário ${email} já existe.`);
      if (existingUser.password !== hashedPassword) {
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log(`🌱 Seeding: Senha do usuário ${email} atualizada para '123'.`);
      }
    }
  } catch (error: any) {
    console.error('❌ Erro no seeding do usuário administrador:', error.message);
  }
}

// Conectar ao MongoDB Atlas
console.log('🔌 Conectando ao MongoDB Atlas...');
mongoose.connect(mongodbUri)
  .then(() => {
    console.log('🔌 Conectado com sucesso ao MongoDB Atlas!');
    // Executa o seeding do usuário antes de rodar o listen
    seedAdminUser().then(() => {
      app.listen(port, () => {
        console.log(`🚀 Servidor Donna Menina rodando em http://localhost:${port}`);
        console.log(`📌 Rotas da API montadas sob http://localhost:${port}/api`);
      });
    });
  })
  .catch((err: any) => {
    console.error('❌ Erro crítico ao conectar ao MongoDB Atlas:', err.message);
    process.exit(1);
  });
