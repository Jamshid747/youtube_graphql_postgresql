import { USER_CONFIG } from "../../config/index.js"
import { finished } from 'stream/promises'
import model from "./model.js"
import JWT from "#helpers/jwt"
import path from 'path'
import fs from 'fs'


export default {
    Mutation: {
        login: async (_, { username, password }, { agent, userIp }) => {
            username = username.trim()
            password = password.trim()

            const user = await model.login({ username, password })

            console.log(user);

            if(!user) {
                return {
                    status: 400,
                    message: "Wron username or password!",
                    data: null,
                    token: null
                }    
            }
            return {
                status: 200,
                message: "The user logged in successfully!",
                data: user,
                token: JWT.sign({ userId: user.user_id, agent, userIp })
            }
        },

        register: async (_, { username, password, profileImg }, { agent, userIp }) => {
            const { createReadStream, filename, mimetype, encoding } = await profileImg

            if(!['image/jpeg', 'image/jpg', 'image/png'].includes(mimetype)) {
                throw new Error('Wrong profile image format!')
            }

            const fileName = Date.now() + filename.replace(/\s/g, "")
            username = username.trim()
            password = password.trim()

            const user = await model.checkUser({ username })

            if(user) {
                throw new Error('The user already exists!')
            }

            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName));
            createReadStream().pipe(out)
            await finished(out)


            await model.createUser({
                username,
                password,
                fileName
            })

            const newUser = await model.login({
                username,
                password
            })

            return {
                status: 200,
                message: "The user registered successfully!",
                data: newUser,
                token: JWT.sign({ userId: newUser.user_id, agent, userIp })
            }
        }
    },

    Query: {
        users: async (_, { pagination }) => {
            return await model.getUsers({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT
            })
        },
        user: async (_, args) => {
            return await model.getUser(args)
        }
    }

}