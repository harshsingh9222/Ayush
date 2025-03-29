import express from 'express';

const router = express.Router();

// Controller functions
const tempController = {
    // GET /temp/
    getAll: async (req, res) => {
        try {
            // In a real scenario you might fetch data from a database
            res.status(200).json({ message: 'Retrieved all records successfully.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /temp/
    create: async (req, res) => {
        try {
            // In a real scenario you might create a new record in the database
            const data = req.body;
            res.status(201).json({ message: 'Record created successfully.', data });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /temp/:id
    update: async (req, res) => {
        try {
            // In a real scenario you might update a record in the database
            const { id } = req.params;
            const data = req.body;
            res.status(200).json({ message: `Record ${id} updated successfully.`, data });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /temp/:id
    remove: async (req, res) => {
        try {
            // In a real scenario you might delete a record from the database
            const { id } = req.params;
            res.status(200).json({ message: `Record ${id} deleted successfully.` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// Routes
router.get('/', tempController.getAll);
router.post('/', tempController.create);
router.put('/:id', tempController.update);
router.delete('/:id', tempController.remove);

export default router;