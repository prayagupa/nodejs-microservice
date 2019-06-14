
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Only Wallet' });
};

var Memcached = require('memcached');
var memcached = new Memcached({'localhost:11211':1});

function addSession(){
  memcached.add('session-id1', 'gedifp-001', 10, function (err) {
    if(err) {
      console.log("err adding session: " + err);
    } else {
      console.log("wrote session1 to session-server")
      memcached.get('session-id1', function (err, data) {
        console.log("session: " + data);
      });
    }
  });

  memcached.set('session-id1', 'sjhfjs-002', 10, function (err) {
    if(err) {
      console.log("err setting new session: " + err);
    } else {
      console.log("updated session2 to session-server")
      memcached.get('session-id1', function (err, data) {
        console.log("session: " + data);
      });

    }
  });
}

addSession();
