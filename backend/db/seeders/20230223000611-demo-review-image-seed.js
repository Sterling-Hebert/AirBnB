"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: "image url1",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 2,
          url: "image url2",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 3,
          url: "image url3",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 4,
          url: "image url",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 5,
          url: "image url",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 6,
          url: "image url",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 7,
          url: "image url",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 8,
          url: "image url",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          reviewId: 9,
          url: "image url",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    return queryInterface.bulkDelete(options, null, {});
  },
};
