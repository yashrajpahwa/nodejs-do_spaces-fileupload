const express = require('express');
const app = express();
const dotenv = require('dotenv');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
dotenv.config();

aws.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_KEY,
});

const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new multer.MulterError('Please upload a PDF file'));
    }
  },
  storage: multerS3({
    s3,
    bucket: 'conceptometry',
    acl: 'public-read',
    // eslint-disable-next-line
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}${file.originalname}`);
    },
    contentType: function (req, file, cb) {
      cb(null, `application/pdf`);
    },
  }),
}).single('file');

app.post('/', upload, (req, res, next) => {
  if (!req.file) {
    res.status(400).json({
      message: 'Please upload a file',
    });
  } else {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
        let error;
        if (err.name === 'MulterError') {
          error = err.code;
        } else {
          error = err;
        }
        return res.status(400).json({ success: false, message: error });
      }
      const url = req.file.location;

      console.log(
        `${url.split('digitaloceanspaces.com')[0]}cdn.digitaloceanspaces.com${
          url.split('digitaloceanspaces.com')[1]
        }`
      );

      return res.status(200).json({ message: 'File uploaded successfully.' });
    });
  }
});

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
