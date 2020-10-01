const multer = require('multer');
const { deleteFile, onError, transformFilename } = require('../constants/index');

//  video uploads
const videoFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },
    filename: (req, file, cb) => {
        // console.log({file});
        const name = file.originalname;
        cb(null, `${new Date().toISOString()}-${transformFilename(24)}${name.substr(name.lastIndexOf('.'))}`);
    }
});


const isVideo = filemimetype => {
    switch (filemimetype) {
        case 'video/x-msvideo':
            return true;
        case 'video/x-flv':
            return true;
        case 'video/webm':
            return true;
        case 'video/x-m4v':
            return true;
        case 'video/mp4':
            return true;
        case 'video/mpeg':
            return true;
        case 'video/mpeg':
            return true;
        case 'video/mpeg':
            return true;
        case 'video/ogg':
            return true;
        case 'video/x-matroska':
            return true;
        case 'video/webm':
            return true;
        default:
            return false;
    }
}


const videoFilter = (req, file, cb) => {
    if (isVideo(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

exports.videoUploadMiddleware = multer({ storage: videoFileStorage, fileFilter: videoFilter })
    .fields([
        { name: 'videofile', maxCount: 1 },
    ]);