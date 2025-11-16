const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors()); 

app.use(express.json());



app.use('/api/cliente', require('./routes/clienteRoutes'));
app.use('/api/login', require('./routes/loginRoutes'));
app.use('/api/farmacia', require('./routes/farmaciaRoutes'));


module.exports = app;
