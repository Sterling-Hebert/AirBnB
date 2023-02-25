"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          startDate: new Date(2023, 5, 17),
          endDate: new Date(2023, 5, 25),
        },
        {
          spotId: 2,
          userId: 2,
          startDate: new Date(2024, 10, 2),
          endDate: new Date(2024, 10, 20),
        },
        {
          spotId: 3,
          userId: 3,
          startDate: new Date(2023, 10, 2),
          endDate: new Date(2023, 10, 8),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return queryInterface.bulkDelete(options, null, {});
  },
};
