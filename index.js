const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// Use Morgan Middleware for Logging
app.use(morgan('dev'));

connectDB();

app.use(express.json());

// Route for the root URL
app.get('/', (req, res) => {
    res.json( "Welcome to the User Auth TEST :)" );
  });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
