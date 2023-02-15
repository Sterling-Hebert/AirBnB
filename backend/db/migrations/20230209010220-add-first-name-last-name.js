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
    await queryInterface.addColumn("Users", "firstName", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "lastName", {
      type: Sequelize.STRING,
    }),
      options;
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.dropColumn(options, "firstName", {
      type: Sequelize.STRING,
    });
    await queryInterface.dropColumn(options, "lastName", {
      type: Sequelize.STRING,
    });
  },
};