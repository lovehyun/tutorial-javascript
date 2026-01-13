import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/v1', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
