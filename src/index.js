const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use('/images', express.static(path.join('public/images')));

// Routes
app.use(require('./routes/racks'));

// Start server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});