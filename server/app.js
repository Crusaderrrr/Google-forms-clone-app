const express = require('express');
const app = express();
const cors = require('cors');
const auth = require('./routes/auth');
const templates = require('./routes/templates');
const forms = require('./routes/forms');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
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
app.use('/api/forms', forms);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Server listening on port: ${port}`)});