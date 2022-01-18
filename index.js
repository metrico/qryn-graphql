const gql = require('graphql-yoga')
const fs = require('fs')
const axios = require('axios')

const debug = process.argv[2]

/* Configuration */

const rawConfig = fs.readFileSync('config.json', 'utf8')
const config = JSON.parse(rawConfig)

const baseURL = config.url || 'http://localhost:3100'

/* Graph QL Setup - clokiSchema */
const typeDefs = fs.readFileSync('clokiSchema.graphql', 'utf8')

/* Graph QL Setup - Resolvers */
const resolvers = {
  Query: {
    ready: async () => {
      const response = await axios.get(`${baseURL}/ready`)
      if (debug) console.log('response::::::::', response.data)
      return response.data
    },

    hello: async () => {
      const response = await axios.get(`${baseURL}/hello`)
      if (debug) console.log('response::::::::', response.data)
      return response.data
    },

    query_range: async (parent, args) => {
      if (debug) console.log('query_range query started')
      let string = ''

      if (args.query.length > 0) {
        string += 'query=' + args.query
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.start !== undefined) {
        string += '&start=' + args.start
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.end !== undefined) {
        string += '&end=' + args.end
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.limit !== undefined) {
        string += '&limit=' + args.limit
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.direction !== undefined) {
        string += '&direction=' + args.direction
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.regex !== undefined) {
        string += '&regex=' + args.regex
        if (debug) console.log(`added to query => ${string}`)
      }

      const response = await axios.get(`${baseURL}/loki/api/v1/query_range?` + string)
      if (debug) console.log('response::::::::', response.data)
      return response.data
    },

    query: async (parent, args) => {
      if (debug) console.log('query started')
      let string = ''

      if (args.query.length > 0) {
        string += 'query=' + args.query
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.limit !== undefined) {
        string += '&limit=' + args.limit
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.time !== undefined) {
        string += '&time=' + args.time
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.direction !== undefined) {
        string += '&direction=' + args.direction
        if (debug) console.log(`added to query => ${string}`)
      }

      const response = await axios.get(`${baseURL}/loki/api/v1/query?` + string)
      if (debug) console.log('response::::::::', response.data)
      return response.data
    },

    labels: async (obj, args) => {
      if (debug) console.log('Label query is started')
      let string = ''

      if (args.start !== undefined) {
        string += 'start=' + args.start
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.end !== undefined) {
        string += '&end=' + args.end
        if (debug) console.log(`added to query => ${string}`)
      }
      const response = await axios.get(`${baseURL}/loki/api/v1/labels?` + string)
      if (debug) console.log('response::::::::', response.data)
      return response.data
    },

    label: async (obj, args) => {
      if (debug) console.log('Label query is started')
      let string = ''

      if (args.start !== undefined) {
        string += 'start=' + args.start
        if (debug) console.log(`added to query => ${string}`)
      }

      if (args.end !== undefined) {
        string += '&end=' + args.end
        if (debug) console.log(`added to query => ${string}`)
      }
      const response = await axios.get(`${baseURL}/loki/api/v1/label/${args.name}/values?` + string)
      if (debug) console.log('response::::::::', response.data)
      return response.data
    }
  },

  Result: {
    stream: (obj, args) => {
      if (debug) console.log('RESULT is called ::::::::', obj)
      let string = ''
      for (const key in obj.stream) {
        string += key + '=' + obj.stream[key] + ', '
      }
      string = string.slice(0, -2)
      return string
    }
  },

  Object: {
    timestamp: (obj, args) => {
      if (debug) console.log('OBJECT is called::::::::', obj)
      return obj[0]
    },
    value: (obj, args) => {
      if (debug) console.log('OBJECT is called::::::::', obj)
      return obj[1]
    }
  },

  Mutation: {
    addData: async (obj, args) => {
      if (debug) console.log('Mutation is called:::::::', obj, args)
      // insert data to cloki and query for the inserted tags
      const timestamp = (Date.now() * 1000000).toString()
      const dataObject = {}
      dataObject.streams = []
      const value = [timestamp, args.data]
      if (debug) console.log('value ::: ', value)
      const stream = {}
      for (const item of args.tag) {
        if (debug) console.log('ITEM :::::::', item)
        stream[item.key] = item.value
      }
      if (debug) console.log('stream ::: ', stream)
      const streamObject = {
        stream: stream,
        values: [value]
      }
      dataObject.streams.push(streamObject)
      if (debug) console.log('Object ready for insert', dataObject)
      const response = await axios.post(`${baseURL}/loki/api/v1/push`, dataObject, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (debug) console.log('response ::::', response.data)

      let string = ''
      string += 'query={'
      for (const item of args.tag) {
        if (debug) console.log('ITEM :::::::', item)
        string += item.key + '=' + '"' + item.value + '",'
      }
      string = string.slice(0, -1)
      string += '}'
      if (debug) console.log(`added to query => ${string}`)

      const returned = await axios.get(`${baseURL}/loki/api/v1/query_range?` + string)
      if (debug) console.log('response::::::::', returned.data)
      return returned.data
    }
  }

}

const server = gql.createServer({
  typeDefs: typeDefs,
  resolvers: resolvers
})

server.start(() => {
  console.log('Server started on Port 4000', debug || ' - Production Mode')
})
