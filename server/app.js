const express = require('express');
const app = express();
const cors = require('cors');
const auth = require('./routes/auth');
const templates = require('./routes/templates')
const session = require('express-session');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,       
    resave: false,                 
    saveUninitialized: false,      
    cookie: { maxAge: 60 * 60 * 1000, secure: false } 
  })
);

app.use('/api/auth', auth);
app.use('/api/templates', templates);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Server listening on port: ${port}`)});