import express from 'express';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const port = process.env.PORT || 3000;

//middleware
const __filename = dirname(fileURLToPath(import.meta.url));
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));






//frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})



//Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)



app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});


