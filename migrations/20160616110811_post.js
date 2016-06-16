exports.up = function(knex, Promise) {
    return knex.schema.createTable('post', function(table) {
        table.increments();
        table.string('blog');
        table.string('image');
        table.string('name');
        table.integer('user_id').references('user.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('post');
};
