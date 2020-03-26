'use strict'

const User = use('App/Models/User')
const Cloudinary = use('App/Services/Cloudinary')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const testEmail = request.input('email')

    const testUser = await User.findBy('email', testEmail)

    if (!testUser) {
      let image_url

      const data = request.only(['username', 'email', 'phone', 'password'])

      const img = request.file('user_image', {
        types: ['image'],
        size: '2mb' 
      })

      if (img) {
        try {
          let cloudinary_response = await Cloudinary.upload(img)
          image_url = cloudinary_response.url 
        } catch {
          image_url = null
        } 
      }
      else {
        image_url = null
      }
      const user = await User.create({ ...data, image_path: image_url })
      return response.status(201).json({ user })
    } else {
      return response.status(409).send('this email is already registered')
    }

  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth }) {

    if (auth.user) 
      return auth.user
    else 
      return response.status('401').send('Not Authorized!')
      
  }
  
  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {

    const data = request.all()
    const user = auth.user
    
    if (params.user_id == user.id) {
      user.merge({ username: data.username })
      user.merge({ email: data.email })
      user.merge({ phone: data.phone })

      await user.save()

      return response.status(200).json(user)
    } else {
      return response.status('401').send('Not Authorized!')
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
