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
          review: "Great place",
          stars: 4,
          spotId: 3,
          userId: 1,
        },
        {
          review: "Terrible, won't visit again",
          stars: 1,
          spotId: 1,
          userId: 2,
        },
        {
          review: "Loved it, will come again",
          stars: 5,
          spotId: 2,
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
