const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const fileRouter = require('./router/file');

const app = express();

// define accepted headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3040'); //or specific separated by commas
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// static image serving 
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads', 'videos')));

// Accept JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// add the routes to use
app.use('/files', fileRouter);

// define a default
app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({
        message: error.message,
        data: JSON.stringify(error)
    });
});

// app.use('/', (req, res) => {
//     res.send('<p>File API server is running.</p>')
// })

mongoose.connect('mongodb://localhost:27017/fileDecoder', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: true
}).then(res => {
    app.listen(3040)
    console.log("Server listening on port 3040");
}).catch(error => {
    console.log(error);
})
