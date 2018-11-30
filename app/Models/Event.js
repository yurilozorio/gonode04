'use strict'

const Model = use('Model')

class Event extends Model {
  static get dates () {
    return ['created_at', 'updated_at', 'date']
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Event
