'use strict'

const Contact = use('App/Models/Contact')
const Cloudinary = use('App/Services/Cloudinary')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contacts
 */
class ContactController {
  /**
   * Show a list of all contacts.
   * GET contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth, request, response }) {
    const user_id = auth.user.id
    
    const contacts = await Contact.query().where('user_id', '=', user_id).fetch()

    // return response.status(200).json(contacts)
    return contacts
  }

  /**
   * Create/save a new contact.
   * POST contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    let image_url

    const id = auth.user.id

    const data = request.only([
      'name',
      'email',
      'phone'
    ])

    const img = request.file('contact_image', {
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

    const contact = await Contact.create({...data, image_path: image_url, user_id: id})

    return response.status(201).json(contact)
  }

  /**
   * Display a single contact.
   * GET contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, }) {
    const contact = await Contact.findOrFail(params.id)

    return contact
  }

  /**
   * Update contact details.
   * PUT or PATCH contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ContactController
