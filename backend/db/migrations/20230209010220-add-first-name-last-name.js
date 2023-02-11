"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    options.tableName = "Users";
    await queryInterface.addColumn(options, "firstName", {
      type: Sequelize.STRING(30),
    });
    await queryInterface.addColumn(options, "lastName", {
      type: Sequelize.STRING(30),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     *
     */
    options.tableName = "Users";
    await queryInterface.dropColumn(options, "firstName", {
      type: Sequelize.STRING,
    });
    await queryInterface.dropColumn(options, "lastName", {
      type: Sequelize.STRING,
    });
  },
};
