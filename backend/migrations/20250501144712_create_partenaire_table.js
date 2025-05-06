exports.up = function(knex) {
    return knex.schema.createTable('partenaire', (table) => {
      table.increments('id').primary();
      table.string('companyName', 255).nullable();
      table.string('phone', 50).nullable();
      table.string('partnershipType', 50).nullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('partenaire');
  };