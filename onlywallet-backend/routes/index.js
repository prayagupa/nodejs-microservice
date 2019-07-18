
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Only Wallet' });
};

exports.cache = function(req, res){
  console.log("cache ")
  var s = syncAddSession(res)
  res.render('index', { title: 'Only Wallet' });
};



var Memcached = require('memcached');
var memcached = new Memcached({'localhost:11211':1});

async function syncAddSession(response){
  var res = await addSession
  console.log("res")
  response.setHeader('session', 'test')
  return res
}

function addSession(){
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

addSession();

