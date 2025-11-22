const farmaciaService = require('../services/farmaciaService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            console.log('🔐 TENTATIVA DE LOGIN - EMAIL:', email);
            console.log('🔐 TENTATIVA DE LOGIN - SENHA:', senha ? '***' : 'FALTANDO');
            console.log('🔐 BODY COMPLETO:', req.body);

            if (!email || !senha) {
                console.log('❌ EMAIL OU SENHA FALTANDO');
                return res.status(400).json({ 
                    success: false,
                    error: 'Email e senha são obrigatórios' 
                });
            }

            let farmacia;
            try {
                console.log('🔍 BUSCANDO FARMÁCIA NO BANCO...');
                farmacia = await farmaciaService.buscarPorEmail(email);
                console.log('✅ FARMÁCIA ENCONTRADA:', {
                    id: farmacia.id,
                    email: farmacia.email,
                    nome: farmacia.nome,
                    temSenha: !!farmacia.senha,
                    tipo: farmacia.tipo
                });
            } catch (error) {
                console.log('❌ ERRO AO BUSCAR FARMÁCIA:', error.message);
                return res.status(401).json({ 
                    success: false,
                    error: 'Credenciais inválidas' 
                });
            }
            
            console.log('🔑 COMPARANDO SENHA...');
            console.log('   - Senha recebida:', senha);
            console.log('   - Hash no banco:', farmacia.senha ? 'EXISTE' : 'NÃO EXISTE');
            
            const senhaValida = await bcrypt.compare(senha, farmacia.senha);
            console.log('🔑 RESULTADO DA COMPARAÇÃO:', senhaValida);
            
            if (!senhaValida) {
                console.log('❌ SENHA INVÁLIDA');
                return res.status(401).json({ 
                    success: false,
                    error: 'Credenciais inválidas' 
                });
            }

            console.log('✅ LOGIN BEM-SUCEDIDO');
            
            // ✅ CORREÇÃO AQUI - ADICIONE farmaciaId
            const token = jwt.sign(
                { 
                    id: farmacia.id, 
                    email: farmacia.email, 
                    tipo: farmacia.tipo,
                    nome: farmacia.nome,
                    farmaciaId: farmacia.id // ← LINHA ADICIONADA
                }, 
                process.env.JWT_SECRET || 'segredo',
                { expiresIn: '24h' }
            );

            console.log('✅ TOKEN GERADO COM SUCESSO');

            return res.json({
                success: true,
                token,
                farmacia: {
                    id: farmacia.id,
                    nome: farmacia.nome,
                    email: farmacia.email,
                    tipo: farmacia.tipo
                }
            });

        } catch (err) {
            console.error('💥 ERRO GRAVE NO LOGIN:', err);
            console.error('💥 STACK:', err.stack);
            return res.status(500).json({ 
                success: false,
                error: 'Erro interno do servidor' 
            });
        }
    }
};