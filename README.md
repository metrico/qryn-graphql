<img src="https://user-images.githubusercontent.com/1423657/147935343-598c7dfd-1412-4bad-9ac6-636994810443.png" width=220 />

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
