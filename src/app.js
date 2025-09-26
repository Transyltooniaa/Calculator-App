import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import calcRoute from './routes/calc.js';
import uiRoute from './routes/ui.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', uiRoute);
app.use('/calc', calcRoute);

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(err.status || 500).json({ error: err.expose ? err.message : 'Internal Server Error' });
});

export default app;
