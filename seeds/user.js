exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE comment, post, users RESTART IDENTITY CASCADE')
    .then(function() {
        return Promise.all([
            knex("users").insert({
                name: 'Pawel Maciulewski'
            }).returning('id'),
            knex("users").insert({
                name: 'Zach Zimmerman'
            }).returning('id'),
            knex("users").insert({
                name: 'Evan McClaugherty'
            }).returning('id')
        ]);
    })
  .then(function(ids) {
      var pawel = ids[0][0],
          zach = ids[1][0],
          evan = ids[2][0];
      return Promise.all([
          knex('post').insert({
              name: 'Germany vs. POLAND',
              blog: 'POLSKA FOR LIFE BROS',
              image: 'https://pbs.twimg.com/media/ByAQ6tDIEAAPDhJ.jpg',
              users_id: 1
          }).returning('id'),
          knex('post').insert({
              name: 'NBA Finals Game 6',
              blog: 'Golden State is up 3-2 in the series and the Cavs are at home in Cleveland. I see the Cavs squeezing out game 6 and forcing a Game 7!',
              image: 'http://media.cleveland.com/plain-dealer/photo/2014/09/18/proposed-lebron-james-banner-5563d1c42bfde2a9.jpg',
              users_id: 2
          }).returning('id'),
          knex('post').insert({
              name: 'Ping Pong Championship',
              blog: 'I love it when Ma Long screams everytime he hits the ball!',
              image: 'http://ste.india.com/sites/default/files/2015/05/02/352944-ma-long.jpg',
              users_id: 3
          }).returning('id')
        ])
      .then(function(postIds) {
                return {
                    posts: {
                        zero: postIds[0][0],
                        one: postIds[1][0],
                        two: postIds[2][0]
                    },
                    users: {
                        pawel: pawel,
                        zach: zach,
                        evan: evan,
                    }
                }
            })
          })
        .then(function(data) {
            return Promise.all([
                knex('comment').insert({
                    comment: 'POLSKA POLSKA POLSKA POLSKA POLSKA POLSKA POLSKA!',
                    users_id: data.users.zach,
                    post_id: data.posts.zero
                }),
                knex('comment').insert({
                    comment: 'But you got to love Steph Curry!',
                    users_id: data.users.evan,
                    post_id: data.posts.one
                }),
                knex('comment').insert({
                    comment: 'Ma Long is my homeboi!',
                    users_id: data.users.pawel,
                    post_id: data.posts.two
                })
            ]);
        })
};
