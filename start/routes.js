'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/register', 'UserController.store')
Route.post('/login', 'AuthController.login')

Route.group(() => {
  Route.get('profile', 'UserController.show')
  Route.put('editprofile', 'UserController.edit')
  Route.get('show', 'UserController.show')
})
.prefix('user')
.middleware(['auth'])

Route.group(() => {
  Route.post('register', 'ContactController.store')
  Route.get('contact/:id', 'ContactController.show')
  Route.get('all', 'ContactController.index')
})
.prefix('contact')
.middleware(['auth'])
// Route.post('/contact/register', 'ContactController.store').middleware('auth')


