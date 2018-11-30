'use strict'

const Event = use('App/Models/Event')

const moment = require('moment')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   */
  async index ({ auth }) {
    const events = await Event.query()
      .where('user_id', auth.user.id)
      .orderBy('date', 'desc')
      .fetch()

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   */
  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])

    const duplicated = !!(await Event.query()
      .where({ user_id: auth.user.id, date: data.date })
      .first())

    if (duplicated) {
      return response.status(400).send({
        error: {
          message: 'Cannot add event at same time from another'
        }
      })
    }

    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   */
  async show ({ response, params, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response
        .status(401)
        .send({ error: { message: 'Permission denied' } })
    }

    await event.load('user')

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   */
  async update ({ response, params, request, auth }) {
    const event = await Event.findOrFail(params.id)
    const data = request.only(['title', 'location', 'date'])

    if (event.user_id !== auth.user.id) {
      return response
        .status(401)
        .send({ error: { message: 'Permission denied' } })
    }

    if (moment(event.date).isBefore(moment.now())) {
      return response
        .status(400)
        .send({ error: { message: 'Past events cannot be updated' } })
    }

    const duplicated = !!(await Event.query()
      .where({ user_id: auth.user.id, date: data.date })
      .first())

    if (duplicated) {
      return response.status(400).send({
        error: {
          message: 'There is already an event scheduled for this date/time'
        }
      })
    }

    event.merge(data)

    await event.save()

    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   */
  async destroy ({ response, params, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response
        .status(401)
        .send({ error: { message: 'Permission denied' } })
    }

    if (moment(event.date).isBefore(moment.now())) {
      return response
        .status(400)
        .send({ error: { message: 'Past events cannot be deleted' } })
    }

    event.delete()
  }
}

module.exports = EventController
