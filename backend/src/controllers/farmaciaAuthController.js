const farmaciaService = require('../services/farmaciaService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res) {
    try {
        const { email, senha } = req.body;

        console.log('🔐 [CONTROLLER] Dados recebidos:');
        console.log('   - Email:', `"${email}"`);
        console.log('   - Senha:', `"${senha}"`);
        console.log('   - Tipo de senha:', typeof senha);
        console.log('   - Tamanho senha:', senha.length);

        if (!email || !senha) {
            return res.status(400).json({ 
                success: false,
                error: 'Email e senha são obrigatórios' 
            });
        }

        const farmacia = await farmaciaService.buscarPorEmail(email);
        
        // TESTE DIRETO DO BCRYPT
        console.log('🔑 [CONTROLLER] Testes de comparação:');
        
        // Teste 1: Comparação normal
        const teste1 = await bcrypt.compare(senha, farmacia.senha);
        console.log('   - Teste 1 (normal):', teste1);
        
        // Teste 2: Com trim
        const teste2 = await bcrypt.compare(senha.trim(), farmacia.senha);
        console.log('   - Teste 2 (com trim):', teste2);
        
        // Teste 3: Senha hardcoded
        const teste3 = await bcrypt.compare('123456', farmacia.senha);
        console.log('   - Teste 3 ("123456"):', teste3);
        
        // Teste 4: Verificar se o hash é válido
        const hashValido = farmacia.senha.startsWith('$2');
        console.log('   - Hash válido?:', hashValido);

        if (!teste1) {
            console.log('❌ [CONTROLLER] Todas as comparações falharam');
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