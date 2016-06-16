var knex = require('./knex')

module.exports = {
  get: function () {
    return knex.table('blog').select();
  },
  insert: function (data) {
    return knex.table('blog').insert(data);
  },
  delete: function (id) {
    return knex.table('blog').where({id: id}).del();
  }
}
