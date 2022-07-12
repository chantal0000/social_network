const aws = require("aws-sdk");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    //this means we are running locally
    secrets = require("./secrets.json");
}

// console.log("secrets", secrets);
// below creates an instance of an AWS user -> it's an object that
// gives us a bunchh of methods to communicate and interact
// with our s3 cloud storage that amazon calls bucket
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file on request");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling", // if you are using own credentials this needs to be updated by your bucket name
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            console.log("yay that worked our img is in the cloud");
            next();
            //used to remove a file or symbolic link from the filesystem.
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("smth went wrong with the cloud", err);
            return res.sendStatus(500);
        });
};
