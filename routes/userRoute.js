const express = require('express');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', async (req, res) => {
    await getAllUsers(req, res);
});

router.get('/:id', async (req, res) => {
    await getUserById(req, res);
});

router.post('/', async (req, res) => {
    await createUser(req, res);
});

router.put('/:id', async (req, res) => {
    await updateUser(req, res);
});

router.delete('/:id', async (req, res) => {
    await deleteUser(req, res);
});

module.exports = router;