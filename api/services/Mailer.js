
var emailRecipients = function(to) {
    var recipients = ["chao.wang02@gmail.com", "info@alloko.com"];
    if(!to)
        recipients.push(to);
    console.log("email recipients:" + recipients.join(";"));
    return recipients.join(";");
} 

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
                to: emailRecipients(),
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
                to: emailRecipients(),
                subject: `A short message [${obj.subject}]`
            },
            function (err) { 
                console.log(err || "Mail should be Sent .");
            }
        )
    },
    sendResetEmail: function(obj) {
        sails.hooks.email.send(
            "resetEmail",
            {
                email: obj.email,
                password: obj.password,
            },
            {
                //to: obj.email,
                to: emailRecipients(),
                subject: `Request for Password Reset has been processed`
            },
            function (err) { 
                console.log(err || "Mail should be Sent .");
            }
        )
    },
}