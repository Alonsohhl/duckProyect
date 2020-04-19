const db = require('../src/db')
function destroyUser(id, done) {
  return db.user.destroy({
    where: {
      id: id
    }
  })
  // .then(function () {
  //   return done()
  // })
}

exports.destroyUser = destroyUser
