'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/ShareEventMail')

const Event = use('App/Models/Event')

const moment = require('moment')

class ShareController {
  async create ({ request, response, params, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response
        .status(401)
        .send({ error: { message: 'Permission denied' } })
    }

    const recipientEmail = request.input('recipient_email')

    const { name, email } = auth.user
    const { title, location } = event

    const date = moment(event.date).format('DD/MM/YYYY')
    const time = moment(event.date).format('HH:mm:ss')

    Kue.dispatch(
      Job.key,
      { recipientEmail, name, email, title, location, date, time },
      {
        attempts: 3
      }
    )
  }
}

module.exports = ShareController
