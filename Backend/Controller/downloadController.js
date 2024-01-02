const AWS = require('aws-sdk');

const Download = require('../Models/download');
const Expense = require('../Models/xpense');

async function uploadToS3(data, filename) {
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    })
    
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((res, rej) => s3bucket.upload(params, (err, s3response) => {
        if (err) {
            rej(err);
        } else {
            res(s3response.Location)
        }
    }))
}

exports.downloading = async (req, res, next) => {
    try {

        const uid = req.userID.userId;
        const xpenses = await Expense.findAll({ where: { UserId: uid } });

        const stringFied = JSON.stringify(xpenses);

        const filename = `Expenses${uid}/${new Date()}.txt`;

        const fileUrl = await uploadToS3(stringFied, filename);

        const z = await Download.create({ url: fileUrl, userId: uid, date: new Date() });

        res.status(200).json({ fileUrl, success: true });


    } catch (err) {
        console.log(err);
        res.status(500).json({ success: true, message: 'Failed to download' });
    }
}


exports.allURL = async (req, res, next) => {
    try {
        const id = req.userID.userId;
        const download = await Download.findAll({ where: { UserId: id } });
        res.status(200).json(download);

    } catch (err) {
        console.log(err);
    }
}