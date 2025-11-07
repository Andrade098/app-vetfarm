-- ====================================
-- VETFARM - BANCO DE DADOS 
-- ====================================

DROP DATABASE IF EXISTS vetfarm_db;
CREATE DATABASE vetfarm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vetfarm_db;

-- ====================================
-- TABELA: farmacias_parceiras
-- ====================================
CREATE TABLE farmacias_parceiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(10),
    is_matriz BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_cidade (cidade),
    INDEX idx_matriz (is_matriz)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: usuarios
-- ====================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    foto_perfil_url VARCHAR(255),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP NULL,
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_cpf (cpf)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: enderecos
-- ====================================
CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    apelido VARCHAR(50),
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_principal (usuario_id, principal)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: categorias
-- ====================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    icone_url VARCHAR(255),
    ativa BOOLEAN DEFAULT TRUE,
    ordem_exibicao INT DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome (nome),
    INDEX idx_ordem (ordem_exibicao)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: produtos
-- ====================================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmacia_id INT NOT NULL,
    categoria_id INT,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    principio_ativo VARCHAR(200),
    fabricante VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    preco_promocional DECIMAL(10, 2),
    estoque_atual INT DEFAULT 0,
    estoque_minimo INT DEFAULT 5,
    imagem_url VARCHAR(255),
    receita_obrigatoria BOOLEAN DEFAULT FALSE,
    destaque BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmacia_id) REFERENCES farmacias_parceiras(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_farmacia (farmacia_id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_nome (nome),
    INDEX idx_destaque (destaque, ativo),
    INDEX idx_preco (preco)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: pedidos
-- ====================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    farmacia_id INT NOT NULL,
    endereco_entrega_id INT NOT NULL,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pendente', 'confirmado', 'preparando', 'saiu_para_entrega', 'entregue', 'cancelado') DEFAULT 'pendente',
    subtotal DECIMAL(10, 2) NOT NULL,
    taxa_entrega DECIMAL(10, 2) DEFAULT 0.00,
    desconto DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    forma_pagamento ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'boleto') NOT NULL,
    observacoes TEXT,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_confirmacao TIMESTAMP NULL,
    data_entrega TIMESTAMP NULL,
    data_cancelamento TIMESTAMP NULL,
    motivo_cancelamento TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (farmacia_id) REFERENCES farmacias_parceiras(id) ON DELETE CASCADE,
    FOREIGN KEY (endereco_entrega_id) REFERENCES enderecos(id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_farmacia (farmacia_id),
    INDEX idx_numero_pedido (numero_pedido),
    INDEX idx_status (status),
    INDEX idx_data (data_pedido)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: itens_pedido
-- ====================================
CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    INDEX idx_pedido (pedido_id),
    INDEX idx_produto (produto_id)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: rastreamento_pedidos
-- ====================================
CREATE TABLE rastreamento_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    status ENUM('pendente', 'confirmado', 'preparando', 'saiu_para_entrega', 'entregue', 'cancelado') NOT NULL,
    descricao TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    INDEX idx_pedido (pedido_id),
    INDEX idx_data (data_atualizacao)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: avaliacoes
-- ====================================
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    pedido_id INT,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    UNIQUE KEY unique_avaliacao (produto_id, usuario_id, pedido_id),
    INDEX idx_produto (produto_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_nota (nota)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: favoritos
-- ====================================
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, produto_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_produto (produto_id)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: carrinho
-- ====================================
CREATE TABLE carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_item_carrinho (usuario_id, produto_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: notificacoes
-- ====================================
CREATE TABLE notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('pedido', 'promocao', 'sistema', 'entrega') NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_lida (usuario_id, lida),
    INDEX idx_data (data_envio)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: programa_fidelidade
-- ====================================
CREATE TABLE programa_fidelidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    pontos_atual INT DEFAULT 0,
    pontos_total INT DEFAULT 0,
    nivel ENUM('bronze', 'prata', 'ouro', 'platina') DEFAULT 'bronze',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_nivel (nivel),
    INDEX idx_pontos (pontos_atual)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: historico_pontos
-- ====================================
CREATE TABLE historico_pontos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    programa_id INT NOT NULL,
    pedido_id INT,
    tipo ENUM('ganho', 'resgate', 'expiracao', 'bonus') NOT NULL,
    pontos INT NOT NULL,
    descricao VARCHAR(255),
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (programa_id) REFERENCES programa_fidelidade(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    INDEX idx_programa (programa_id),
    INDEX idx_data (data_transacao)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: cupons
-- ====================================
CREATE TABLE cupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(255),
    tipo_desconto ENUM('percentual', 'valor_fixo') NOT NULL,
    valor_desconto DECIMAL(10, 2) NOT NULL,
    valor_minimo_pedido DECIMAL(10, 2) DEFAULT 0.00,
    data_validade_inicio DATE NOT NULL,
    data_validade_fim DATE NOT NULL,
    uso_maximo INT,
    uso_atual INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_validade (data_validade_inicio, data_validade_fim),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB;

-- ====================================
-- TABELA: cupons_utilizados
-- ====================================
CREATE TABLE cupons_utilizados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cupom_id INT NOT NULL,
    usuario_id INT NOT NULL,
    pedido_id INT NOT NULL,
    data_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cupom_id) REFERENCES cupons(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    INDEX idx_cupom (cupom_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_pedido (pedido_id)
) ENGINE=InnoDB;

-- ====================================
-- TRIGGERS
-- ====================================

-- Trigger: Atualizar estoque após inserir item no pedido
DELIMITER //
CREATE TRIGGER after_item_pedido_insert
AFTER INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    UPDATE produtos 
    SET estoque_atual = estoque_atual - NEW.quantidade
    WHERE id = NEW.produto_id;
END//
DELIMITER ;

-- Trigger: Criar programa de fidelidade ao cadastrar usuário
DELIMITER //
CREATE TRIGGER after_usuario_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO programa_fidelidade (usuario_id) VALUES (NEW.id);
END//
DELIMITER ;

-- Trigger: Adicionar pontos ao confirmar pedido
DELIMITER //
DROP TRIGGER IF EXISTS after_pedido_confirmado;
//
CREATE TRIGGER after_pedido_confirmado
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    -- declarações devem vir primeiro
    DECLARE pontos_ganhos INT DEFAULT 0;

    IF NEW.status = 'confirmado' AND OLD.status <> 'confirmado' THEN
        SET pontos_ganhos = FLOOR(NEW.total / 10);

        UPDATE programa_fidelidade 
        SET pontos_atual = pontos_atual + pontos_ganhos,
            pontos_total = pontos_total + pontos_ganhos
        WHERE usuario_id = NEW.usuario_id;

        INSERT INTO historico_pontos (programa_id, pedido_id, tipo, pontos, descricao)
        SELECT pf.id, NEW.id, 'ganho', pontos_ganhos, CONCAT('Pontos do pedido ', NEW.numero_pedido)
        FROM programa_fidelidade pf
        WHERE pf.usuario_id = NEW.usuario_id;
    END IF;
END//
DELIMITER ;


-- ====================================
-- DADOS DE TESTE
-- ====================================

-- Farmácias Parceiras
INSERT INTO farmacias_parceiras (nome, descricao, email, senha_hash, telefone, endereco, bairro, cidade, estado, cep, is_matriz) VALUES
('VetFarm Matriz', 'Farmácia veterinária matriz - Produtos para animais de grande e pequeno porte', 'matriz@vetfarm.com.br', '$2b$10$ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567', '(11) 99999-8888', 'Av. Paulista, 1000', 'Bela Vista', 'São Paulo', 'SP', '01310-100', TRUE),
('Farmácia Vet Central', 'Especializada em produtos para pets', 'central@farmaciavet.com.br', '$2b$10$DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890', '(11) 98888-7777', 'Rua Augusta, 500', 'Consolação', 'São Paulo', 'SP', '01305-000', FALSE);

-- Categorias
INSERT INTO categorias (nome, descricao, ordem_exibicao) VALUES
('Medicamentos', 'Medicamentos veterinários diversos', 1),
('Antiparasitários', 'Produtos para controle de parasitas', 2),
('Vacinas', 'Vacinas para animais', 3),
('Suplementos', 'Suplementos vitamínicos e alimentares', 4),
('Higiene', 'Produtos de higiene e limpeza', 5),
('Rações', 'Rações e alimentos', 6);

-- Usuários
INSERT INTO usuarios (nome, sobrenome, email, senha_hash, cpf, telefone, data_nascimento) VALUES
('João', 'Silva', 'joao.silva@email.com', '$2b$10$Cliente1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ123456', '123.456.789-00', '(11) 98888-7777', '1985-05-15'),
('Maria', 'Santos', 'maria.santos@email.com', '$2b$10$Cliente2345678901BCDEFGHIJKLMNOPQRSTUVWXYZ234567', '987.654.321-00', '(11) 97777-6666', '1990-08-20'),
('Pedro', 'Oliveira', 'pedro.oliveira@email.com', '$2b$10$Cliente3456789012CDEFGHIJKLMNOPQRSTUVWXYZ345678', '456.789.123-00', '(11) 96666-5555', '1988-03-10');

-- Endereços
INSERT INTO enderecos (usuario_id, apelido, logradouro, numero, complemento, bairro, cidade, estado, cep, principal) VALUES
(1, 'Fazenda Principal', 'Estrada Rural', 'Km 15', 'Propriedade São José', 'Zona Rural', 'Campinas', 'SP', '13100-000', TRUE),
(1, 'Casa', 'Rua das Flores', '123', 'Apto 45', 'Jardins', 'São Paulo', 'SP', '01234-567', FALSE),
(2, 'Trabalho', 'Av. Brigadeiro', '890', 'Sala 12', 'Centro', 'São Paulo', 'SP', '01210-000', TRUE),
(3, 'Residência', 'Rua São João', '456', NULL, 'Vila Nova', 'Campinas', 'SP', '13050-000', TRUE);

-- Produtos
INSERT INTO produtos (farmacia_id, categoria_id, nome, descricao, principio_ativo, fabricante, preco, preco_promocional, estoque_atual, receita_obrigatoria, destaque) VALUES
(1, 1, 'Antibiótico Veterinário 500mg', 'Antibiótico de amplo espectro para bovinos e equinos', 'Penicilina G', 'VetPharma', 89.90, 79.90, 150, TRUE, TRUE),
(1, 2, 'Vermífugo Plus 10ml', 'Vermífugo de amplo espectro para cães e gatos', 'Ivermectina', 'AnimalCare', 45.50, NULL, 200, FALSE, TRUE),
(1, 3, 'Vacina Antirrábica', 'Vacina contra raiva para cães e gatos', 'Vírus inativado', 'ImmunoVet', 65.00, 59.90, 80, TRUE, FALSE),
(2, 4, 'Suplemento Vitamínico 120 caps', 'Complexo vitamínico para reforço imunológico', 'Multivitamínico', 'VitaPet', 120.00, 99.90, 50, FALSE, TRUE),
(2, 5, 'Shampoo Antipulgas 500ml', 'Shampoo com ação antipulgas e carrapatos', 'Permetrina', 'CleanPet', 38.90, NULL, 100, FALSE, FALSE),
(1, 6, 'Ração Premium Cães Adultos 15kg', 'Ração super premium para cães adultos', NULL, 'PremiumDog', 189.90, 169.90, 75, FALSE, TRUE),
(2, 1, 'Anti-inflamatório Vet 20ml', 'Anti-inflamatório para dor e inflamação', 'Meloxicam', 'VetPharma', 78.50, NULL, 120, TRUE, FALSE),
(1, 2, 'Coleira Antipulgas', 'Coleira com proteção de 8 meses', 'Deltametrina', 'PetProtect', 95.00, 85.00, 60, FALSE, TRUE);

-- Pedidos
INSERT INTO pedidos (usuario_id, farmacia_id, endereco_entrega_id, numero_pedido, status, subtotal, taxa_entrega, desconto, total, forma_pagamento) VALUES
(1, 1, 1, 'VF-2024-00001', 'entregue', 135.40, 15.00, 0.00, 150.40, 'pix'),
(2, 2, 3, 'VF-2024-00002', 'saiu_para_entrega', 218.90, 12.00, 10.00, 220.90, 'cartao_credito'),
(3, 1, 4, 'VF-2024-00003', 'preparando', 169.90, 10.00, 0.00, 179.90, 'cartao_debito');

-- Itens dos Pedidos
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 2, 2, 45.50, 91.00),
(1, 5, 1, 38.90, 38.90),
(2, 4, 1, 99.90, 99.90),
(2, 6, 1, 169.90, 169.90),
(3, 6, 1, 169.90, 169.90);

-- Rastreamento
INSERT INTO rastreamento_pedidos (pedido_id, status, descricao) VALUES
(1, 'pendente', 'Pedido recebido'),
(1, 'confirmado', 'Pagamento confirmado'),
(1, 'preparando', 'Pedido em separação'),
(1, 'saiu_para_entrega', 'Pedido saiu para entrega'),
(1, 'entregue', 'Pedido entregue ao cliente'),
(2, 'pendente', 'Pedido recebido'),
(2, 'confirmado', 'Pagamento confirmado'),
(2, 'preparando', 'Pedido em separação'),
(2, 'saiu_para_entrega', 'Pedido saiu para entrega'),
(3, 'pendente', 'Pedido recebido'),
(3, 'confirmado', 'Pagamento confirmado'),
(3, 'preparando', 'Pedido em separação');

-- Favoritos
INSERT INTO favoritos (usuario_id, produto_id) VALUES
(1, 1),
(1, 2),
(1, 6),
(2, 4),
(2, 8),
(3, 6),
(3, 3);

-- Notificações
INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo, lida) VALUES
(1, 'Pedido Entregue', 'Seu pedido VF-2024-00001 foi entregue com sucesso!', 'entrega', TRUE),
(2, 'Pedido a Caminho', 'Seu pedido VF-2024-00002 saiu para entrega!', 'entrega', FALSE),
(2, 'Promoção Especial', 'Suplementos com até 40% de desconto!', 'promocao', FALSE),
(3, 'Pedido Confirmado', 'Seu pedido VF-2024-00003 foi confirmado!', 'pedido', FALSE);

-- Cupons
INSERT INTO cupons (codigo, descricao, tipo_desconto, valor_desconto, valor_minimo_pedido, data_validade_inicio, data_validade_fim, uso_maximo) VALUES
('PRIMEIRACOMPRA', 'Desconto de 15% para primeira compra', 'percentual', 15.00, 50.00, '2024-01-01', '2024-12-31', 1000),
('FRETE10', 'R$ 10 de desconto no frete', 'valor_fixo', 10.00, 100.00, '2024-01-01', '2024-12-31', NULL),
('VET20', '20% de desconto em medicamentos', 'percentual', 20.00, 150.00, '2024-01-01', '2024-06-30', 500);