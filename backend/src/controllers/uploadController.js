const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    console.log('📁 Tentando salvar em:', uploadsDir);
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Pasta uploads criada');
    }
    
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = 'product-' + uniqueSuffix + ext;
    
    console.log('📸 Nome do arquivo:', filename);
    cb(null, filename);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  console.log('🔍 Verificando tipo de arquivo:', file.mimetype);
  console.log('📤 Campo do arquivo:', file.fieldname);
  console.log('📄 Nome original:', file.originalname);
  
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.log('❌ Tipo de arquivo rejeitado:', file.mimetype);
    cb(new Error('Apenas imagens são permitidas!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limite
  }
});

// ✅ MIDDLEWARE DE DEBUG
const debugMiddleware = (req, res, next) => {
  console.log('=== 📥 INÍCIO DO UPLOAD ===');
  console.log('📋 Headers:', req.headers['content-type']);
  console.log('🔍 Método:', req.method);
  console.log('📊 Tem body?:', !!req.body);
  console.log('📁 Tem file?:', !!req.file);
  console.log('📁 Tem files?:', !!req.files);
  console.log('=== 🏁 FIM DO UPLOAD ===');
  next();
};

// Controlador principal
const uploadImage = (req, res) => {
  try {
    console.log('📥 Recebendo upload...');
    
    if (!req.file) {
      console.log('❌ Nenhum arquivo recebido no req.file');
      console.log('🔍 Body:', req.body);
      console.log('🔍 Headers:', req.headers);
      
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem foi enviada ou campo incorreto',
        debug: {
          hasFile: !!req.file,
          hasFiles: !!req.files,
          bodyKeys: Object.keys(req.body),
          contentType: req.headers['content-type']
        }
      });
    }

    console.log('✅ Arquivo recebido:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    // Retornar a URL da imagem
    const imageUrl = `/uploads/${req.file.filename}`;
    
    console.log('🖼️ URL da imagem:', imageUrl);
    
    res.json({
      success: true,
      message: 'Imagem uploadada com sucesso',
      url: imageUrl,
      filename: req.file.filename
    });
    
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor: ' + error.message
    });
  }
};

module.exports = {
  uploadMiddleware: upload.single('image'),
  uploadImage,
  debugMiddleware
};