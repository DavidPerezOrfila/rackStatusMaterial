const express = require('express');
const router = express.Router();
const pool = require('../db/dbCon');
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const fs = require('fs');

router.get('/racks', (req, res, next) => {
    pool.query(
        `SELECT * FROM rackStatus ORDER BY id ASC`, (err, rows) => {
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
        }
    );
});

router.get('/racks/:id', (req, res, next) => {

    const { id } = req.params;

    pool.query(
        'SELECT * FROM rackStatus WHERE id = ?', [id], (err, rows) => {
            if (!err) {
                res.json(rows[0]);
            } else {
                console.log(err);
            }
        }
    );
});

router.post('/racks', (req, res, next) => {
    const { id, host, lat, lng, ico, img, info } = req.body;
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
});

router.put('/racks/:id', (req, res, next) => {
    let { host, lat, lng, ico, img, info } = req.body;
    const { id } = req.params;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                message: 'No ha seleccionado ningún archivo',
                err: { mensaje: 'Debe seleccionar una imagen' }
            })
    }

    // Obtener nombre del archivo
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    let nombre = nombreCortado[nombreCortado.length - 2];

    // Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            })
    }
    let pathAntiguo = img;
    // Nombre del archivo personalizado
    //id+nombre+fecha.ext
    let nombreArchivo = `${id}${nombre}${Date.now()}.${extension}`;

    // Mover archivo del temporal a una ruta concreta
    archivo.mv(`public/assets/img/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        comprobarImagen(id, pathAntiguo, nombreArchivo);
    });


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
});

router.delete('/racks/:id', (req, res, next) => {
    const { id } = req.params;
    const query = `
    DELETE FROM rackStatus WHERE id = ?
    `;

    pool.query(query, [id], (err) => {
        if (!err) {
            res.json({
                Status: 'Rack eliminado'
            });
        } else {
            console.log(err);
        }
    });
});

function comprobarImagen(id, pathAntiguo, nombreArchivo) {
    this.id = id;
    let pathCortado = pathAntiguo.split('/');
    let imagen = pathCortado[pathCortado.length - 1];
    let path = `public/assets/img/${imagen}`
    fs.unlinkSync(path);
    img = `/static/assets/img/${nombreArchivo}`;
};

module.exports = router;