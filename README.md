<img src="https://user-images.githubusercontent.com/1423657/147935343-598c7dfd-1412-4bad-9ac6-636994810443.png" width=220 />

# cloki-graphql
GraphQL Overlay for the cLoki/LogQL API


Use GraphQL to query cLoki saved logs. With some extension of the schema and the code you could easily use cLoki to build websites, visualization backends or other great applications. ( {sky:"limit"} )


## Installation

Clone this repository, install with ```npm``` and run using ```nodejs``` 14.x (or higher)

```
npm install
```

to install the dependencies.


Modify the config.json file to point to your cLoki instance of choice:

```JSON
{
  "url": "http://localhost:3100"
}
```

## Usage

Once you start the service, navigate to
```
http://localhost:4000
```

To play around with some of the basic logQL queries use below:

```

// to see all the available fields
query range {
  query_range (query:"{label=\"value\"}", start:1641591598081000000, end:1642196398081000000, limit:1000) {
    status
    data {
      resultType
      result {
        stream
        values {
          timestamp
          value
        }
      }
    }
  }
}

// or to see just the values

query simple {
  query_range (query:"{label=\"value\"}", start:1641591598081000000, end:1642196398081000000, limit:1000) {
    data {
      result {
        values {
          value
        }
      }
    }
  }
}
```

## API Coverage

*[ ] /loki/api/v1/push
*[X] /loki/api/v1/query
*[X] /loki/api/v1/query_range
*[X] /loki/api/v1/label
*[X] /loki/api/v1/label/name/values
*[ ] /loki/api/v1/tail
*[ ] /hello
*[ ] /ready
