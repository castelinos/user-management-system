const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' })

// to allow frontend to send GET, POST, PUT request
const corsOptions = {
  origin: `http://localhost:${process.env.SVELTE_PORT}`,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const authRoutes = require('./routes/auth');

app.use('/api/user', userRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/auth', authRoutes)

// Start the server
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`);
});
