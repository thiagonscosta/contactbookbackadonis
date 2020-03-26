'use strict'
const User = use('App/Models/User')

class AuthController {

    async login ({ request, auth, response }) {
        const { email, password } = request.all()

        const token = await auth.attempt(email, password)

        const user = await User.findByOrFail('email', email) 

        return response.status(200).json({ user, token })
    }
}

module.exports = AuthController
