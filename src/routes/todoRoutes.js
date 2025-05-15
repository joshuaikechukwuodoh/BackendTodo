import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all todos for logged-in user
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

// Create a new todo
router.post('/', (req, res) => {
    const { task } = req.body
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    const result = insertTodo.run(req.userId, task)

    res.json({ id: result.lastInsertRowid, task, completed: 0 })
})

// Update a todo
router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params
    const { page } = req.query

    const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    updatedTodo.run(completed, id)

    res.json({ message: "Todo completed" })
})

// Delete a todo
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userId)
    
    res.send({ message: "Todo deleted" })
})

export default router

















/*** 
import express from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all todo items
router.get('/', authMiddleware, async (req, res) => {
    try {
        const todos = await db.prepare('SELECT * FROM todo').all();
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create todo
router.post('/', authMiddleware, async (req, res) => {
    const { user_id, task } = req.body;

    if (!user_id || !task) {
        return res.status(400).json({ error: 'user_id and task are required' });
    }

    try {
        const result = await db.prepare('INSERT INTO todo (user_id, task) VALUES (?, ?)')
            .run(user_id, task);
        res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// Update todo
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;

    if (!task && completed === undefined) {
        return res.status(400).json({ error: 'At least one field (task or completed) is required' });
    }

    try {
        const updates = [];
        const values = [];

        if (task) {
            updates.push('task = ?');
            values.push(task);
        }
        if (completed !== undefined) {
            updates.push('completed = ?');
            values.push(completed ? 1 : 0);
        }

        values.push(id);
        const query = `UPDATE todo SET ${updates.join(', ')} WHERE id = ?`;
        
        const result = await db.prepare(query).run(...values);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        res.json({ message: 'Todo updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});


// Delete todo
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.prepare('DELETE FROM todo WHERE id = ?').run(id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

export default router;
/***/


