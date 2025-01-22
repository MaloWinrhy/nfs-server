const express = require('express');
const redis = require('redis');
const Piece = require('../models/pieceModel');

const router = express.Router();
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

const cache = (req, res, next) => {
    const { id } = req.params;
    client.get(id, (err, data) => {
        if (err) throw err;
        if (data !== null) {
            res.status(200).json(JSON.parse(data));
        } else {
            next();
        }
    });
};

router.get('/', async (req, res) => {
    try {
        const pieces = await Piece.find();
        res.status(200).json(pieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', cache, async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }
        client.setex(req.params.id, 3600, JSON.stringify(piece));
        res.status(200).json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const piece = new Piece({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    try {
        const newPiece = await piece.save();
        res.status(201).json(newPiece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }

        piece.name = req.body.name || piece.name;
        piece.description = req.body.description || piece.description;
        piece.price = req.body.price || piece.price;

        const updatedPiece = await piece.save();
        client.del(req.params.id);
        res.status(200).json(updatedPiece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }

        await piece.remove();
        client.del(req.params.id);
        res.status(200).json({ message: 'Piece deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
router.get('/page/:pageNumber', async (req, res) => {
    const pageSize = 10;
    const pageNumber = parseInt(req.params.pageNumber);

    try {
        const pieces = await Piece.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        const totalPieces = await Piece.countDocuments();
        res.status(200).json({
            pieces,
            totalPages: Math.ceil(totalPieces / pageSize),
            currentPage: pageNumber
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});