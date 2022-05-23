import { makeExecutableSchema } from "@graphql-tools/schema"

import TypeModule from './types/index.js'
import UserModule from './users/index.js'
import VideoModule from './videos/index.js'

export default makeExecutableSchema({
    typeDefs: [
        TypeModule.typeDefs,
        UserModule.typeDefs,
        VideoModule.typeDefs
    ],
    resolvers: [
        TypeModule.resolvers,
        UserModule.resolvers,
        VideoModule.resolvers
    ]
})