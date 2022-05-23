import { 
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { graphqlUploadExpress } from 'graphql-upload'
import queryParser from "#helpers/queryParser"
import schema from "./modules/index.js"
// import model from "#helpers/model"
import ip from "#helpers/getip"
// import query from './query.js'
import JWT from '#helpers/jwt'
import express from 'express'
import http from 'http'
import path from 'path'
import "./config/index.js"

!async function () {
  const app = express()
  const httpServer = http.createServer(app)

  app.use(express.static(path.join(process.cwd(), 'uploads')))
  app.use(graphqlUploadExpress())
  
  

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: ({ req, res }) => {
      const { operation, fieldName } = queryParser(req.body)

      if(fieldName == '__schema') return

      if(['login', 'register', 'videos', 'userVideos', 'users', 'user'].includes(fieldName)) {
        return {
          agent: req.headers['user-agent'],
          userIp: req.ip
        }
      }

      const TOKEN = req.headers?.token?.trim()

      if(!TOKEN) {
        throw new Error('Token is required!')
      }

      const { userId, agent, userIp } = JWT.verify(TOKEN)

      if(
        req.headers['user-agent'] != agent ||
        req.ip != userIp
      ) throw new Error('Wrong device!')

      return {
        userId,
        agent: req.headers['user-agent'],
        userIp: req.ip
      }
    },
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageGraphQLPlayground({ httpServer })
      ]
        
  })

  await server.start()
  server.applyMiddleware({ app, path: '/', })

  await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://${ip({ internal: false })}:${process.env.PORT}${server.graphqlPath}`)
}()
