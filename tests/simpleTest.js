/**
 * Created by bogdanbiv on 6/17/14.
 */

//var superagent = require('superagent');
//var expect = require('expect.js');
var expect = require('chai').expect,
  chaiAsPromised = require('chai-as-promised'),
  sinonChai = require('sinon-chai');

var util = require('util');
var rp = require('request-promise');
var mongoose = require('mongoose'),
  request = require('request'),
  supertest = require('supertest');
var bunyan = require('bunyan');

function xafter(){}


  // 'express rest api server'
  describe('express rest api server', function() {
      var calItemSchema, CalItem;
      var newid = "";
      var startDate = new Date(), endDate = new Date(startDate.getTime() + 3600000);
      newid = new mongoose.Types.ObjectId();
      /*before(function() {
        var Schema = mongoose.Schema;
        mongoose.connect('mongodb://localhost:27017/collections/calitems');

        var calItemSchema = new Schema({
          *//*_id: {type:Schema.ObjectId},*//*
          summary: String,
          startTime: String,
          endTime: String,
          calendar: String,
          allDay: Boolean
        });

        CalItem = mongoose.model('calItem', calItemSchema);
      });*/

      xafter(function() {});

      /*beforeEach(function(done) {
        var startDate, endDate;

        startDate = new Date((new Date()).setHours(8));
        endDate = new Date((new Date()).setHours(9));

        testCalItem = new CalItem({
          "summary": "New event 8",
          "startTime": stamp.toISOString(startDate),
          "endTime": stamp.toISOString(endDate),
          "calendar": "cal1",
          "allDay":false
        });

        testCalItem.save(function(err, item, numberAffected) {
          if (!err && numberAffected === 1) {
            console.log('testCalItem: ' + JSON.stringify(item));
          } else {
            ('Err: ' + err + '; Affected: ' + numberAffected + '; ' + JSON.stringify(item));
          }
          done();
        });
      });*/

    it('get all items', function (done) { // works
      // var dfd = this.async(1000);

      /*startDate = new Date((new Date()).setHours(10));
       endDate = new Date((new Date()).setHours(11));
       done();*/

      return rp.get('http://localhost:3000/collections/calitems/')
        .then(function(response) {
          expect(response).to.be.a('string');
          console.log('77: ' + typeof(response)); // 200
          results = JSON.parse(response);
          expect(results.length).to.equal(1);
          done();
        }).catch(function(e) {
          done(e);
        }); /*.then(function(text){
         assert.strictEqual(text.summary, 'New event 10', 'checking calItem.summary');
         return text;
         //            expect(res.body.length).to.eql(1);
         //            expect(res.body[0]._id.length).to.eql(24);
         //            _id = res.body[0]._id;
         }, function() {
         });*/
    });

      it('get specific item', function(done) {
        var localId = '54a8d6b126e514ec1affd33d';
        return rp.get('http://localhost:3000/collections/calitems/' + localId).
          then(function(response) {
            expect(response).to.be.a('string');
            var result = JSON.parse(response);
            expect(result).to.have.property('startTime');
            // expect(result.startTime).to.be.a('object');
            //  expect(result.startTime).to.be.an.instanceof(Date);
            console.log('100: ' + response); // 200
            done();
          }).catch(function(e) {
            done(e);
          });
      });

      it('create item', function (done) {
        // var dfd = this.async(1000);

        /*startDate = new Date((new Date()).setHours(10));
        endDate = new Date((new Date()).setHours(11));
        done();*/

        return rp.put('http://localhost:3000/collections/calitems/__tempID__1', {
          form: {
            "_id": newid,
            "id": "__tempID__1",
            "summary":"New event 10",
            "startTime": startDate.toISOString(),
            "endTime": endDate.toISOString(),
            "calendar":"cal1",
            "allDay":false
          }
        }).then(function(response) {
          expect(response).to.be.a('string');
          var result = JSON.parse(response);
          expect(result).to.have.property('endTime');
          expect(result.endTime).to.equal(endDate.toISOString());
          done();
        }).catch(function(e) {
          done(e);
        }); /*.then(function(text){
            assert.strictEqual(text.summary, 'New event 10', 'checking calItem.summary');
            return text;
//            expect(res.body.length).to.eql(1);
//            expect(res.body[0]._id.length).to.eql(24);
//            _id = res.body[0]._id;
        }, function() {
        });*/
      });

    it('remove specific item', function(done) {
      var localId = '54af71ceabbd40c314e00d85';
      return rp.del('http://localhost:3000/collections/calitems/' + localId).
        then(function(response) {
          expect(response).to.be.a('string');
          var result = JSON.parse(response);
          expect(result).to.have.property('startTime');
          // expect(result.startTime).to.be.a('object');
          //  expect(result.startTime).to.be.an.instanceof(Date);
          console.log('100: ' + response); // 200
          done();
        }).catch(function(e) {
          done(e);
        });
    });

      xit('retrieves an object', function(done) {
          return rp.put('http://localhost:3000/collections/calitems/', {
            data:{
              "id": "__tempID__1",
              "summary":"New event 10",
              "startTime": startDate.toISOString(),
              "endTime": endDate.toISOString(),
              "calendar":"cal1",
              "allDay":false
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            handleAs: 'json',
            sync: false
          }).then(function(response) {
            console.log('121: ' + response.statusCode); // 200
            console.log('122: ' + response.headers['content-type']); // 'image/png'
          }).catch(function(err) {
            console.error('119: ' + util.inspect(err));
          }).then(done);
            /*.then(function(res) {
              console.log('Object GGGGGGG: ' + res + ' retrieved.');
              *//*dfd.reject('Error getting object' + err.stack);
              dfd.resolve('Object ' + text1 + ' retrieved.');*//*
            });*/

        /*retrieved = request.get(
          'http://localhost:3000/collections/calitems/' + beforeEachDfd._id,
          {sync: false}).then(function() {
                console.log('Object ' + JSON.stringify(arguments) + ' retrieved.');
        },function(err) {
            console.log(err);
        });

        return retrieved;*/

        /*testObj = request.put('http://localhost:3000/collections/calitems/5',
          {
            data:{"_id":5,"summary":"New event 5","startTime":"2014-07-08T06:00:00.000Z","endTime":"2014-07-08T06:15:00.000Z","calendar":"cal1","allDay":false},
            sync: false,
            handleAs: "json"
          }).then(function(calItem_ids) {
            if (Array.isArray(calItem_ids) && calItem_ids.length > 0) {
              return calItem_ids;
            } else {
              dfd.reject('returned data is of type: ' + typeof(calItem_ids));
            }
          }, function(err) {
            dfd.reject('Error creating test object ' + err.stack);
          }).then(function(calItem_ids1) {
            request.get('http://localhost:3000/collections/calitems/' + calItem_ids1[0]._id, {sync: false}).then(dfd.callback(function(text1) {
                    dfd.resolve('Object ' + text1 + ' retrieved.');
                  }),
                  function(err) {
                    console.log(err);
                    dfd.reject('Error getting object' + err.stack);
                  });
          });*/ // dfd1.reject.bind(dfd1)
      });

    /*it('retrieves an object', function(done){
        superagent.get('http://localhost:3000/collections/test/'+_id)
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body._id.length).to.eql(24)
                expect(res.body._id).to.eql(_id)
                done()
            })
    })

    it('retrieves a collection', function(done){
        superagent.get('http://localhost:3000/collections/test')
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null)
                expect(res.body.length).to.be.above(0)
                expect(res.body.map(function (item){return item._id})).to.contain(_id)
                done()
            })
    })

    it('updates an object', function(done){
        superagent.put('http://localhost:3000/collections/test/'+_id)
            .send({name: 'Peter'
                , email: 'peter@yahoo.com'})
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body.msg).to.eql('success')
                done()
            })
    })

    it('checks an updated object', function(done){
        superagent.get('http://localhost:3000/collections/test/'+_id)
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body._id.length).to.eql(24)
                expect(res.body._id).to.eql(_id)
                expect(res.body.name).to.eql('Peter')
                done()
            })
    })
    it('removes an object', function(done){
        superagent.del('http://localhost:3000/collections/test/'+_id)
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object')
                expect(res.body.msg).to.eql('success')
                done()
            })
    })*/
  });
//});