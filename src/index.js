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
app.use('/static', express.static('public'));

// Routes
app.use(require('./routes/racks'));

// Start server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});