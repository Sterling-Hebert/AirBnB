"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2019/4/16/1/HUHH2019-Waterfront_Jensen-Beach-FL_1.jpg.rend.hgtvcom.966.725.suffix/1555426473700.jpeg",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 2,
          url: "https://resource.co/sites/default/files/article_teaser_image/London-flats.jpg",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 3,
          url: "https://www.mountainliving.com/content/uploads/2021/11/l/z/aspen-grove-005.jpg",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 4,
          url: "https://ewscripps.brightspotcdn.com/dims4/default/92c3d38/2147483647/strip/true/crop/3085x1735+0+0/resize/1280x720!/quality/90/?url=http%3A%2F%2Fewscripps-brightspot.s3.amazonaws.com%2F6c%2F28%2Ff3fb2e7e40d1801009f723973896%2F11th-st-share-downtown-rendering-2022.jpg",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 5,
          url: "https://i.pinimg.com/736x/fb/44/7b/fb447bb6547ef7928e50b2167483970f--beach-front-homes-beach-homes.jpg",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    return queryInterface.bulkDelete(options, null, {});
  },
};
