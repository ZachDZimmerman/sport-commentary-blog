var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(request, response, next) {
  knex("users")
    .select()
    // .select(["users.name as User", "post.name as Post"])
    .join("comment", function () {
      this.on("users.id", "=", "comment.users_id")
    })
    .join("post", function () {
      this.on("post.id", "=", "comment.post_id")
    })
    .then(function (data) {
      console.log(data)
      response.render('index', {users: data });
    })
    .catch(function (error) {
      console.error(error)
      next(error)
    })
});

module.exports = router;
