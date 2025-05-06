exports.up = function(knex) {
    return knex.schema.createTable('visiteur', (table) => {
      table.increments('id').primary();
      table.integer('visitorId').notNullable();
      table.enu('visitorType', ['Adherent', 'NonAdherent', 'Partenaire']).notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('visiteur');
  };