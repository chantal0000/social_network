const aws = require("aws-sdk");
let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS.SECRET,
    region: "eu-west-1",
});

exports.sendEmail = (recipient, message, subject) => {
    return ses
        .sendEmail({
            // put in email here
            Source: "Broken Coaster <broken.coaster@spicedling.email>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("it worked! ses email/ youve got an email"))
        .catch((err) => console.log("smth went wrong sending the email", err));
};
