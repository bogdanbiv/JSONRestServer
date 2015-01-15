/**
 * Created by bogdanbiv on 6/17/14.
 */
var express = require('express'),
  mongoskin = require('mongoskin'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  util = require('util'),
  bunyan = require('bunyan'),
  app = express(),
  cors = require('express-cors');

// See http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
(function(global) {
  var db = mongoskin.db('mongodb://localhost:27017/collections/calitems'/*, {safe:true}*/);
  app.use(bodyParser());

  function reqSerializer(req) {
    return {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    }
  }

  function resSerializer(res) {
    return {
      type: res.length,
      status: res.status,
      headers: res.body
    }
  }

  var log = bunyan.createLogger({
    name: 'grunt-express-example',
    streams: [
      {
        level: 'error',
        stream: process.stdout            // log ERRORand above to stdout
      },
      {
        level: 'info',
        path:  __dirname + '/access.log' // log INFO and above to a file
      }
    ],
    src: true,
    serializers: { req: reqSerializer, res: resSerializer } // bunyan.stdSerializers // {req: reqSerializer }
  });

  // Maintain a map of already-encountered types for super-fast lookups. This
  // serves the dual purpose of being an object from which to use the function
  // Object.prototype.toString for retrieving an object's [[Class]].
  var types = {};

  // Return a useful value based on a passed object's [[Class]] (when possible).
  Object.toType = function(obj) {
    var key;
    // If the object is null, return "Null" (IE <= 8)
    return obj === null ? "Null"
      // If the object is undefined, return "Undefined" (IE <= 8)
      : obj === undefined ? "Undefined"
      // If the object is the global object, return "Global"
      : obj === global ? "Global"
      // Otherwise return the XXXXX part of the full [object XXXXX] value, from
      // cache if possible.
      : types[key = types.toString.call(obj)] || (types[key] = key.slice(8, -1));
  };

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Expose-Headers", "Accept-Ranges, Content-Encoding, Content-Length, X-Content-Range,  Content-Range");
    res.header("Access-Control-Allow-Headers", "Range, Origin, X-Content-Range, Content-Range, " +
      "X-Requested-With, Content-Type, Content-Length, Accept, X-Range, " +
      "If-Match, If-None-Match, Authorization");
    next();
  });

  app.param('collectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName);
    return next();
  });

  app.use(function(req, res, next) {
    req.log = log.child({reqId: uuid()} );
    next();
  });

  app.get('/', function(req, res, next) {
    res.send('please select a collection, e.g., /collections/messages');
    log.info({req: req}, "root instructions");
  });

  app.get('/collections/:collectionName', function(req, res, next) {
    req.collection.find({} ,{limit:20, sort: [['_id',-1]]}).toArray(function(e, results){
      if (e) return next(e);
      results = results.map(function(item){item.id=item._id; return item;});
      res.send(results);
    });

    log.info({req: req}, "get all collection");
  });

  app.post('/collections/:collectionName', function(req, res, next) {
    var item = new Object(req.body);
    var tempId = item["id"];

    delete item["id"];
    for (key in item) {
      if (key[0] === ('_') && key != '_id') { delete item[key]; }
    }

    req.collection.insert(item, {safe:true, multi:false}, function(e, result){
      if (e) return next(e);
      if ((Object.toType(result) === "Array") && (result.length === 1)) {
        result[0]["id"] = tempId;
        res.send(result[0]);
      } else {
        res.send({msg: "error " + e});
      }
    });

    log.info({req: req}, "post new item");
    return;
    /*req.collection.updateById(req.params.id, {$set:item}, {safe:true, multi:false}, function(e, result){
     if (e) return next(e);
     res.send((result===1)? item : {msg: "error"});
     });*/
  });

  app.get('/collections/:collectionName/:id', function(req, res, next) {
    req.collection.findById(req.params.id, function(e, result){
      if (e) return next(e);
      log.info({req: req, res: result}, 'Get specific item[0]');
      result.id = result._id;
      res.send(result);
    });

    log.info({req: req}, "get item details");
  });

  // insert OR !!! UPDATE
  app.put('/collections/:collectionName/:id', function(req, res, next) {
    var item = new Object(req.body);
    item.id = item._id;
    log.info('put id '+ req.params.id + ": " + JSON.stringify(req.body));
    rqBody_id = req.body._id;
    rqBodyid = req.body.id;
    delete req.body._id;
    delete req.body.id;
    var paramId = req.params.id;

    if ((paramId.length > 10) && (paramId.slice(0, 10) === "__tempID__")) {
      // Insert
      req.collection.insert(req.body, function(e, results) {
        if (e || (Object.toType(results) !== "Array") && (results.length !== 1)) {
          return next(e);
        } else {
          results[0].id = results[0]._id;
          res.send(results[0]);
        }
      });
    } else {
      // Update
      if (typeof(req.body._id) === "string") {
        itemId = req.body._id;
        delete(req.body._id);
      } else {
        itemId = req.params.id;
      }
      // test if paramId === req.body._id and req.body.id
      req.collection.updateById(
        itemId, {$set: req.body},
        {safe:true, multi:false, strict:true},
        function(e, results){
          if (e || results !== 1) {
            return next(e);
          }

          req.body._id = itemId;
          console.log("rqBody: " + req.body);
          res.send(req.body);
        });
    }
    log.info({req: req, res: res}, "put id [" + Object.keys(req.params) + "]");
  });

  app.del('/collections/:collectionName/:id', function(req, res, next) {
    req.collection.removeById(req.params.id, function(e, result){
      if (e) return next(e);
      res.send((result===1)?{msg:'success'}:{msg: "error"});
    });
    log.info({req: req}, "delete id " + req.params.id);
  });

  /*app.use(logger('dev'));*/ 					// log every request to the console
  log.info("hi");
  app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
}(this));



/*app.listen(3000);*/
/*console.log('Magic happens on port 3000');*/

module.exports = app;