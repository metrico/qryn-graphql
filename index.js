const gql = require('graphql-yoga')

const typeDefs = `
  type Query {
    ready: String
  }
`

const resolvers = {
  Query: {
    ready: () => 'It\'s a go!'
  }
}

const server = gql.createServer({
  typeDefs: typeDefs,
  resolvers: resolvers
})

server.start(() => {
  console.log('Server started on Port 4000')
})
