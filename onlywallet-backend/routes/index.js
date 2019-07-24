
/*
 * GET home page.
 */

var Memcached = require('memcached');
var memcached = new Memcached({'localhost:11211':1});

exports.index = function(req, res){
  res.render('index', { title: 'Only Wallet' });
};

exports.cache = function(req, res){
  console.log("cache ")
  addSession2().then(session => {
    res.status(200).send({'data': session});
  })
};

async function syncAddSession(response){
  var res = await addSession
  console.log("res")
  response.setHeader('session', 'test')
  return res
}

function addSession1(){
  memcached.add('user-id1', JSON.stringify({"session_id": "gedifp-001"}), 10, function (err) {
    if(err) {
      console.log("err adding session: " + err);
      
    } else {
      console.log("wrote session1 to session-server")
      memcached.get('user-id1', function (err, data) {
        console.log("session: " + data);
      });
    }
  });

  memcached.set('user-id1', JSON.stringify({"session_id": "sjhfjs-002"}), 10, function (err) {
    if(err) {
      console.log("err setting new session: " + err);
    } else {
      console.log("updated session2 to session-server")
      memcached.get('user-id1', function (err, data) {
        console.log("session: " + JSON.parse(data).session_id);
      });

    }
  });
}

function addSession2(){
 
    var addTask = new Promise((s, f) => {
     memcached.add('user-id1', JSON.stringify({"session_id": "updupdupd-001"}), 10, function (err) {
      if(err) {
        s({"added": false})
      } else  {
        s({"added": true})
      }
    })
    })

    var data = addTask.then(r => {
      console.log("after: " + JSON.stringify(r))
      var t2 = new Promise((s1, f1) => {
         memcached.get('user-id1', (e, v) => {
           if(!e){
             console.log('[.then] user-id1 from session-server: ' + v)
	     s1(JSON.parse(v))
           } else {
             s1({})
	   }
         })
      })
      return t2
    })
    return data
}

//addSession2();

