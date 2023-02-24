"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";

    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "1212 flordia drive",
          city: "miami",
          state: "florida",
          country: "US",
          lat: 21,
          lng: 24,
          name: "Miami Beach Resort",
          description: "Beach resort off the south tip of Miami",
          price: 22,
        },
        {
          ownerId: 1,
          address: "1313 London Lane",
          city: "London",
          state: "n/a",
          country: "UK",
          lat: 42,
          lng: 46,
          name: "London Flat",
          description: "Apartment overlooking Big Ben",
          price: 44,
        },
        {
          ownerId: 1,
          address: "1414 Colorado Cove",
          city: "Denver",
          state: "Colorado",
          country: "US",
          lat: 11,
          lng: 32,
          name: "Colorado Ranch",
          description: "Colorado Ranch far from the reaches of others",
          price: 66,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  },
};
