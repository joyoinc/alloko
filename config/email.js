module.exports.email = {
    service: "Mailgun",
    auth: {
        user: "postmaster@sandbox46a65f645f744318911c7611bf42d5a0.mailgun.org", 
        pass: process.env.MAILGUN_PSW
    },
    from: "info@alloko.com",
    testMode: false,
}