const Article = require('../models/articleModel');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createArticle = async (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        article.title = req.body.title || article.title;
        article.content = req.body.content || article.content;
        article.author = req.body.author || article.author;

        const updatedArticle = await article.save();
        res.status(200).json(updatedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        await article.remove();
        res.status(200).json({ message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};