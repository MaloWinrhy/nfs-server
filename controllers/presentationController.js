const Presentation = require('../models/presentationModel');

exports.getAllPresentations = async (req, res) => {
    try {
        const presentations = await Presentation.find();
        res.status(200).json({
            status: 'success',
            results: presentations.length,
            data: {
                presentations
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getPresentationById = async (req, res) => {
    try {
        const presentation = await Presentation.findById(req.params.id);
        if (!presentation) {
            return res.status(404).json({
                status: 'fail',
                message: 'No presentation found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                presentation
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.createPresentation = async (req, res) => {
    try {
        const newPresentation = await Presentation.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                presentation: newPresentation
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updatePresentation = async (req, res) => {
    try {
        const presentation = await Presentation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!presentation) {
            return res.status(404).json({
                status: 'fail',
                message: 'No presentation found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                presentation
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deletePresentation = async (req, res) => {
    try {
        const presentation = await Presentation.findByIdAndDelete(req.params.id);
        if (!presentation) {
            return res.status(404).json({
                status: 'fail',
                message: 'No presentation found with that ID'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};