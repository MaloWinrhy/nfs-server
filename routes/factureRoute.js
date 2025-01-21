const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const router = express.Router();
const eventEmitter = new EventEmitter();

router.use(express.json());

router.post('/', (req, res) => {
    const doc = new PDFDocument();

    const fileName = 'facture.pdf';
    const pdfDir = path.join(process.cwd(), 'pdf');
    const filePath = path.join(pdfDir, fileName);

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir);
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(25).text('Facture', {
        align: 'center'
    });

    doc.fontSize(12).text('Détails de la facture:', {
        align: 'left'
    });

    const details = req.body.details || 'Aucun détail fourni';
    doc.fontSize(12).text(details, {
        align: 'left'
    });

    doc.end();

    writeStream.on('finish', () => {
        eventEmitter.emit('pdfGenerated', filePath, fileName, res);
    });
});

eventEmitter.on('pdfGenerated', (filePath, fileName, res) => {
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Erreur lors du téléchargement du fichier:', err);
            res.status(500).send('Erreur lors du téléchargement du fichier');
        } else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression du fichier:', err);
                }
            });
        }
    });
});

module.exports = router;