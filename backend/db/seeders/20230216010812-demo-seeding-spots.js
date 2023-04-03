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
          ownerId: 3,
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
        {
          ownerId: 1,
          address: "231 N 11th St",
          city: "Las Vegas",
          state: "NV",
          country: "US",
          lat: 11,
          lng: 32,
          name: "Las Vegas Hotel",
          description:
            "Located in Downtown Las Vegas hip Fremont East District, shareDOWNTOWN Fremont East is your home for style, luxury, convenience and community.",
          price: 96,
        },
        {
          ownerId: 1,
          address: "1212 Bev. Hills Drive",
          city: "Los Angeles",
          state: "Cal",
          country: "US",
          lat: 11,
          lng: 32,
          name: "California Beach House",
          description: "Located in beach front Los Angeles",
          price: 100,
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
