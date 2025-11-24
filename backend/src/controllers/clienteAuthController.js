const clienteService = require('../services/clienteService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

console.log('✅ clienteAuthController.js carregado!');

module.exports = {
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            console.log('🔐 LOGIN CLIENTE - EMAIL:', email);
            console.log('🔐 LOGIN CLIENTE - SENHA:', senha ? '***' : 'FALTANDO');

            if (!email || !senha) {
                console.log('❌ EMAIL OU SENHA FALTANDO');
                return res.status(400).json({ 
                    success: false,
                    error: 'Email e senha são obrigatórios' 
                });
            }

            let cliente;
            try {
                console.log('🔍 BUSCANDO CLIENTE NO BANCO...');
                cliente = await clienteService.buscarPorEmail(email);
                console.log('🔍 CLIENTE DO SERVICE (COMPLETO):', JSON.stringify(cliente, null, 2));
                console.log('✅ CLIENTE ENCONTRADO:', {
                    id: cliente.id,
                    email: cliente.email,
                    nome: cliente.nome,
                    sobrenome: cliente.sobrenome,
                    telefone: cliente.telefone,
                    cpf: cliente.cpf,
                    data_nascimento: cliente.data_nascimento,
                    temSenha: !!cliente.senha,
                    todosOsCampos: Object.keys(cliente.get ? cliente.get() : cliente)
                });
            } catch (error) {
                console.log('❌ ERRO AO BUSCAR CLIENTE:', error.message);
                return res.status(401).json({ 
                    success: false,
                    error: 'Credenciais inválidas' 
                });
            }
            
            console.log('🔑 COMPARANDO SENHA DO CLIENTE...');
            console.log('   - Senha recebida:', senha);
            console.log('   - Hash no banco:', cliente.senha ? 'EXISTE' : 'NÃO EXISTE');
            
            const senhaValida = await bcrypt.compare(senha, cliente.senha);
            console.log('🔑 RESULTADO DA COMPARAÇÃO:', senhaValida);
            
            if (!senhaValida) {
                console.log('❌ SENHA INVÁLIDA PARA CLIENTE');
                return res.status(401).json({ 
                    success: false,
                    error: 'Credenciais inválidas' 
                });
            }

            console.log('✅ LOGIN CLIENTE BEM-SUCEDIDO');
            
            const token = jwt.sign(
                { 
                    id: cliente.id, 
                    email: cliente.email, 
                    nome: cliente.nome,
                    sobrenome: cliente.sobrenome,
                     // ⭐⭐ TIPO CLIENTE ⭐⭐
                }, 
                process.env.JWT_SECRET || 'segredo',
                { expiresIn: '24h' }
            );

            console.log('✅ TOKEN CLIENTE GERADO COM SUCESSO');

            return res.json({
                success: true,
                token,
                usuario: { // ⭐⭐ RETORNA "usuario" EM VEZ DE "farmacia" ⭐⭐
                    id: cliente.id,
                    nome: cliente.nome,
                    sobrenome: cliente.sobrenome,
                    email: cliente.email,
                    telefone: cliente.telefone,
                    cpf: cliente.cpf,
                    data_nascimento: cliente.data_nascimento,
                    
                }
            });

        } catch (err) {
            console.error('💥 ERRO GRAVE NO LOGIN CLIENTE:', err);
            console.error('💥 STACK:', err.stack);
            return res.status(500).json({ 
                success: false,
                error: 'Erro interno do servidor' 
            });
        }
    }
};