'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User/Store')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.group(() => {
  Route.put('users', 'UserController.update').validator('User/Update')

  Route.resource('events', 'EventController')
    .apiOnly()
    .validator(new Map([[['events.store', 'events.update'], ['Event']]]))

  Route.post('events/:id/share', 'ShareController.create').validator('Share')
}).middleware(['auth'])
