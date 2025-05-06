exports.up = function(knex) {
    return knex.schema.createTable('nonadherent', (table) => {
      table.increments('id').primary();
      table.string('nom', 255).nullable();
      table.string('prenom', 255).nullable();
      table.string('cin', 50).notNullable();
      table.string('ppr', 50).notNullable();
      table.string('phone', 50).nullable();
      table.string('region', 255).nullable();
      table.string('province', 255).nullable();
      table.string('commune', 255).nullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('nonadherent');
  };