const Piece = require('../models/pieceModel');

exports.getAllPieces = async (req, res) => {
    try {
        const pieces = await Piece.find();
        res.status(200).json(pieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPieceById = async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }
        res.status(200).json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPiece = async (req, res) => {
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
};

exports.updatePiece = async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }

        piece.name = req.body.name || piece.name;
        piece.description = req.body.description || piece.description;
        piece.price = req.body.price || piece.price;

        const updatedPiece = await piece.save();
        res.status(200).json(updatedPiece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePiece = async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }

        await piece.remove();
        res.status(200).json({ message: 'Piece deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};