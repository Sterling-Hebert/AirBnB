"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "reviewImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: "image url1",
        },
        {
          reviewId: 2,
          url: "image url2",
        },
        {
          reviewId: 3,
          url: "image url3",
        },
        {
          reviewId: 4,
          url: "image url",
        },
        {
          reviewId: 5,
          url: "image url",
        },
        {
          reviewId: 6,
          url: "image url",
        },
        {
          reviewId: 7,
          url: "image url",
        },
        {
          reviewId: 8,
          url: "image url",
        },
        {
          reviewId: 9,
          url: "image url",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "reviewsImages";
    return queryInterface.bulkDelete(options, null, {});
  },
};