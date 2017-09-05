
module.exports = {
    sendWelcomeMail: function (obj) {
        sails.hooks.email.send(
            "welcomeEmail",
            {
                //Name: obj.name
                Name: "haha"
            },
            {
                //to: obj.email,
                to: "chao.wang02@gmail.com",
                subject: "Welcome Email"
            },
            function (err) { 
                console.log(err || "Mail should be Sent .");
            }
        )
    },
    sendShortMessage: function(obj) {
        sails.hooks.email.send(
            "shortMessage",
            {
                From: obj.from,
                To: obj.to,
                Body: obj.body
            },
            {
                //to: obj.email,
                to: "chao.wang02@gmail.com",
                subject: `A short message [${obj.subject}]`
            },
            function (err) { 
                console.log(err || "Mail should be Sent .");
            }
        )
    },
}