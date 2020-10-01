const Ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const {winstonLogger} = require('./winstonlogger');

exports.deleteFile = (filePath, next) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            // there was an error
            console.log(err.toString() || `There was an error deleting file: ${filePath}`);
        } else {
            // file deleted
            console.log("DELETE OPERATION ON FILE SUCCESSFUL: ", filePath);
        }
    })
}
//custom error handler
exports.onError = (message, isAsync, next) => {
    const error = new Error(message);
    if (isAsync) {
        return next(error);
    }
    throw error;
}

exports.transformFilename = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.generateFFMPEGProcessFromPath = (originalHighQualityVideoPath) => (new Ffmpeg(
    {
        // input source, required
        source: originalHighQualityVideoPath,
        // timout of the spawned ffmpeg sub-processes in seconds (optional, defaults to 30)
        timeout: 0, //seconds - disable by passing 0
        // default priority for all ffmpeg sub-processes (optional, defaults to 0 which is no priorization)
        priority: 0,
        // set a custom [winston](https://github.com/flatiron/winston) logging instance (optional, default null which will cause fluent-ffmpeg to spawn a winston console logger)
        // logger: null,
        logger: winstonLogger,
        // completely disable logging (optional, defaults to false)
        nolog: false
    }
));

exports.makeGenerateVideFileSaveName = (filenameWithExtension, qualityStr) => {
    let generatedName, lastIndexOfDot, firstPart, extension;
    lastIndexOfDot = filenameWithExtension.lastIndexOf('.');
    extension = filenameWithExtension.substr(lastIndexOfDot);
    firstPart = filenameWithExtension.substr(0, lastIndexOfDot);
    generatedName = firstPart.concat(qualityStr, extension);

    return generatedName;
}