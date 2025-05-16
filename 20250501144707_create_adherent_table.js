exports.up = function(knex) {
    return knex.schema.createTable('adherent', (table) => {
      table.increments('id').primary();
      table.string('adherentNumber', 50).notNullable();
      table.string('nom', 100).notNullable();
      table.string('prenom', 100).notNullable();
      table.string('CIN', 50).nullable();
      table.text('visitReason').nullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('adherent');
  };