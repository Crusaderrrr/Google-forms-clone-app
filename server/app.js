const express = require('express')
const app = express();
const cors = require('cors')
const auth = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(cors());

app.use('/api/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Server listening on port: ${port}`)});