<img src="https://user-images.githubusercontent.com/1423657/147935343-598c7dfd-1412-4bad-9ac6-636994810443.png" width=220 /><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--nkU0GvK3--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://i.postimg.cc/SQCCBw0Q/graphql-with-text-small.png" width=150>

# cloki-graphql
GraphQL Overlay for the [cLoki](https://cloki.org) LogQL API


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

Start the service:
```
npm start
```

## Usage

Access the local GraphQL IDE/API:
```
http://localhost:4000
```

Play around with a basic Graph-LogQL queries:

```
// to render all the available fields
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

// or to render just the values
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

// or insert Data one item at a time via mutation / this will return the last inserted data objects
mutation insert {
  addData(tags: [{
      key: "graphQL",
      value: "test"
    },
    {
      key: "test",
      value: "log"
    }],
    data: "{\"logId\":\"test123\",\"value\":12}") {
    status
    data {
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

```

## API Coverage

* [X] /loki/api/v1/push
* [X] /loki/api/v1/query
* [X] /loki/api/v1/query_range
* [X] /loki/api/v1/label
* [X] /loki/api/v1/label/name/values
* [ ] /loki/api/v1/tail --> Dynamic Tailing will not be able to be supported at this time
* [X] /hello
* [X] /ready
