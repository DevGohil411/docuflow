const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = (file, fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  return s3.upload(params).promise();
};

const deleteFromS3 = (fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  s3,
  uploadToS3,
  deleteFromS3,
};
