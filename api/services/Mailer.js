
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
}