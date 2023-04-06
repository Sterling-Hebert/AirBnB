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
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-50746797/original/d9624ecd-8cd9-46da-a383-8da56598cace.jpeg?im_w=1200",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-50746797/original/110246bd-f0ce-47c8-897e-485978b9259f.jpeg?im_w=720",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-50746797/original/13af01dc-6de8-4684-8feb-2d1ddb46ef7f.jpeg?im_w=720",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-50746797/original/fc5bf69c-1c0c-4b1f-ab1e-b3193b6dde5f.jpeg?im_w=720",
          preview: true,
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-50746797/original/d9624ecd-8cd9-46da-a383-8da56598cace.jpeg?im_w=1200",
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
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOR89O23SxoyR7Qy4Z8wqc5K8Vr4xExZDtiw&usqp=CAU",
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
