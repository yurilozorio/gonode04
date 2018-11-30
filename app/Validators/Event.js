'use strict'

const Antl = use('Antl')

class Event {
  get validateAll () {
    return true
  }

  get sanitizationRules () {
    return {
      date: 'toDate'
    }
  }

  get rules () {
    return {
      title: 'required',
      location: 'required',
      date: `required|date|after:${new Date()}`
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Event
