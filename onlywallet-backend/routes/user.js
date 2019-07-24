
/*
 * GET users listing.
 */

exports.list = function(req, res){
  get_users().then(u => {
    res.setHeader("date", u[0])
    res.send({"users": u})
  })
}

async function us(){
  var users = await get_users()
  return users
}

function get_users() {
  return Promise.resolve(
    ["user1", "user2", "user3"]
  )
}
