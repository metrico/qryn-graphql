# cloki-graphql
GraphQL Overlay for the cLoki/LogQL API

All of the below is still subject to change.

# GraphQL Schema

## Query

Query {
  start: date
  end: date
  step: integer
  limit: integer
  direction: string
  regex: string
  query: string
}

custom date {}


return from API

{"status":"success", "data":{ "resultType": "streams", "result": []}}

## Insert
