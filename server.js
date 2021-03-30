const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
const api = require('./api');
const auth = require('./api/auth');
require('dotenv').config();

// Body Parser Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', api);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});
