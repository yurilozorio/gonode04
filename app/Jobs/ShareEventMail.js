'use strict'

const Mail = use('Mail')

class ShareEventMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'ShareEventMail-job'
  }

  async handle ({ recipientEmail, name, ...data }) {
    try {
      await Mail.send(['emails.share_event'], { name, ...data }, message => {
        message
          .to(recipientEmail)
          .from('hi@adoniscalendar.com', 'Adonis Calendar')
          .subject(`${name} compartilhou um evento com você`)
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = ShareEventMail
