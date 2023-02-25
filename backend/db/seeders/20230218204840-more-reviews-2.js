"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          review: "hated it",
          stars: 1,
          spotId: 2,
          userId: 1,
        },
        {
          review: "My type of place, loved it",
          stars: 5,
          spotId: 3,
          userId: 2,
        },
        {
          review: "Not my fav",
          stars: 2,
          spotId: 1,
          userId: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options, null, {});
  },
};
