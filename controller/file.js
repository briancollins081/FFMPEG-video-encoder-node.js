const path = require('path');

const { deleteFile, onError, generateFFMPEGProcessFromPath, makeGenerateVideFileSaveName } = require('../constants/index');
const File = require('../models/file');

const initializeVideoDecoding = (dbFileObject, videoPath, aspectRation, sizeString, videoHeight, videoFilename) => {
    const ffmpegProc = generateFFMPEGProcessFromPath(videoPath);
    const generatedVideoSaveFilename = makeGenerateVideFileSaveName(videoFilename, videoHeight);

    ffmpegProc.withAspect(aspectRation)
        .withSize(sizeString)
        .applyAutopadding(true, 'black')
        .on('error', function (err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function () {
            console.log('Processing finished !');
            const generatedVideos = JSON.parse(dbFileObject.generated);
            if (!Array.isArray(generatedVideos)) {
                generatedVideos = [];
            }
            generatedVideos.push('uploads/videos/generated/' + videoHeight + '/' + generatedVideoSaveFilename);
            dbFileObject.generated = JSON.stringify(generatedVideos);
            dbFileObject.save().then(res => {
                console.log("Saved " + res + " to db");
            }).catch(err => {
                console.log("Error " + err + " saving generated video to db");
            })
        })
        .saveToFile(path.join(__dirname, '../', 'uploads', 'videos', 'generated', videoHeight, generatedVideoSaveFilename));
}

exports.uploadFile = async (req, res, next) => {
    const filesArray = req.files['videofile'];
    if (!Array.isArray(filesArray) || filesArray.length === 0) {
        return onError("Please supply a video file!", true, next);
    }
    const video = filesArray[0];
    try {
        if (!video) {
            if (video) {
                deleteFile(video.path)
            }
            return onError("You must supply a file!", true, next);
        }
        // Proceed and save the original file while the others are running in the asynchronously
        const file = new File({
            title: video.filename,
            path: video.path,
            generated: JSON.stringify([])
        });

        const savedFile = await file.save();
        // various qualities - limit video upload size @TODO
        // Initialize the file generation processes here
        initializeVideoDecoding(savedFile, video.path, '16:9', '1920x1080', '1080x', video.filename);
        initializeVideoDecoding(savedFile, video.path, '16:9', '1280x720', '720x', video.filename);
        initializeVideoDecoding(savedFile, video.path, '16:9', '854x480', '480x', video.filename);
        initializeVideoDecoding(savedFile, video.path, '16:9', '640x360', '360x', video.filename);
        initializeVideoDecoding(savedFile, video.path, '16:9', '426x240', '240x', video.filename);

        res.json({
            message: "File uploaded successfully",
            file: savedFile,
            success: true
        });
    } catch (error) {
        if (video) {
            deleteFile(video.path);
        }
        res.json({
            message: error.message,
            error: error,
            success: false
        })
    }
}

exports.deleteUploadedFile = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const file = await File.findById(fileId);
        if (!file) {
            return onError(`No file found with id ${fileId}`, true, next);
        }
        await file.deleteOne();
        deleteFile(file.path);
        res.json({
            message: "File deleted successfully!",
            success: true
        })
    } catch (error) {
        res.json({
            message: error.message,
            error: error,
            success: false
        })
    }
}

exports.listAllFiles = async (req, res, next) => {
    try {
        const filesList = await File.find().sort({ createdAt: -1 });
        if (!Array.isArray(filesList)) {
            filesList = [];
        }

        res.json({
            message: "File lists fetched successfully!",
            list: filesList
        });

    } catch (error) {
        res.json({
            message: error.message,
            error: error,
            success: false
        })
    }
}