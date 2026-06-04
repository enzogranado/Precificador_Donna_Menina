import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado ou credenciais inválidas.' });
    }

    // Criptografar a senha enviada usando SHA-256
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (user.password !== passwordHash) {
      return res.status(401).json({ error: 'Senha incorreta ou credenciais inválidas.' });
    }

    return res.json({
      success: true,
      user: {
        email: user.email
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao autenticar usuário.', details: error.message });
  }
});

export default router;
