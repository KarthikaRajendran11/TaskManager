const sgMail = require('@sendgrid/mail')
const config = require('../util/config');

// const sendgridAPIKey = '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'
const sendgridAPIKey = config.get('sendGrid:sendgridAPIKey')
sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: config.get('sendGrid:fromEmail'),
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: config.get('sendGrid:fromEmail'),
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}