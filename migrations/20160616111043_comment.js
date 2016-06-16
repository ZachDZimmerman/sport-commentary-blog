exports.up = function(knex, Promise) {
    return knex.schema.createTable('comment', function(table) {
        table.increments();
        table.text('comment');
        table.integer('user_id').references('user.id');
        table.integer('post_id').references('post.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('comment');
};
