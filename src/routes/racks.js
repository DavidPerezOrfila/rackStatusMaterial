const express = require('express');
const router = express.Router();
const pool = require('../db/dbCon');
const multer = require('multer');
const fs = require('fs');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'public/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split('.');

        let extension = name[name.length - 1];
        let nombre = name[name.length - 2];

        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, nombre + '-' + Date.now() + '.' + ext);
    }
});

router.get('/racks', (req, res, next) => {
    pool.query(`SELECT * FROM rackStatus ORDER BY id ASC`, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/racks/:id', (req, res, next) => {
    const { id } = req.params;

    pool.query('SELECT * FROM rackStatus WHERE id = ?', [id], (err, rows) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post(
    '/racks',
    multer({ storage: storage }).single('archivo'),
    (req, res, next) => {
        const { id, host, lat, lng, ico, info } = req.body;
        const url = req.protocol + '://' + req.get('host');
        let img = url + '/images/' + req.file.filename;
        const query = `
    CALL CreateUpdate(?, ?, ?, ?, ?, ?, ?);
    `;

        pool.query(query, [id, host, lat, lng, ico, img, info], (err, rows) => {
            if (!err) {
                res.json({
                    Status: 'Rack guardado'
                });
            } else {
                console.log(err);
            }
        });
    }
);

router.put(
    '/racks/:id',
    multer({ storage: storage }).single('archivo'),
    (req, res, next) => {
        let { host, lat, lng, ico, img, info } = req.body;
        const { id } = req.params;
        const pathAntiguo = "";

        if (this.img === null || this.img === undefined) {
            const noImage = `src/assets/no-image.png`;
            let noImageCortado = noImage.split('.');
            let noImgExt = noImageCortado[noImageCortado.length - 1];
            let noImg = noImageCortado[noImageCortado.length - 2];

            let pathAntiguoNI = `src/assets/${noImg}` + '-' + Date.now() +
                '.' + `${noImgExt}`;
            let pathCortadoSin = pathAntiguoNI.split('/');
            let sinImagen = pathCortadoSin[pathCortadoSin.length - 1];
            let guardarSi = `public/images/${sinImagen}`;
            this.pathAntiguo = guardarSi;
        } else {
            this.pathAntiguo = this.img;
            let pathCortado = pathAntiguo.split('/');
            let imagen = pathCortado[pathCortado.length - 1];
            let path = `public/images/${imagen}`;
            fs.unlinkSync(path);
        }
        // archivo
        const url = req.protocol + '://' + req.get('host');
        img = url + '/images/' + req.file.filename;

        const query = `
    CALL CreateUpdate(?, ?, ?, ?, ?, ?, ?);
    `;

        pool.query(query, [id, host, lat, lng, ico, img, info], (err, rows) => {
            if (!err) {
                res.json({
                    Status: 'Rack actualizado'
                });
            } else {
                console.log(err);
            }
        });
    }
);

router.delete('/racks/:id', (req, res, next) => {
    const { id } = req.params;
    const query = `
    DELETE FROM rackStatus WHERE id = ?
    `;

    pool.query(query, [id], err => {
        if (!err) {
            res.json({
                Status: 'Rack eliminado'
            });
        } else {
            console.log(err);
        }
    });
});

module.exports = router;