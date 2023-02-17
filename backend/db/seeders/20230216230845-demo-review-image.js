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
          url: "https://www.google.com/search?q=miami+hotel+stock+photos&rlz=1C1CHBF_enUS948US948&sxsrf=AJOqlzXQTeydUb_5Ix-vioVcg8GF3BI_Yg:1676590277565&source=lnms&tbm=isch&sa=X&ved=2ahUKEwij-rW_mZv9AhU9k2oFHQt5AGMQ_AUoAXoECAEQAw&biw=845&bih=916&dpr=1.1#imgrc=zSiGTw_exLuBAM",
        },
        {
          reviewId: 2,
          url: "https://www.google.com/search?q=london+stock+photos+apartment&tbm=isch&ved=2ahUKEwjTjPfvmZv9AhU2G94AHf82AdAQ2-cCegQIABAA&oq=london+stock+photos+apartment&gs_lcp=CgNpbWcQAzoECCMQJzoGCAAQCBAeOgQIABAeUIAHWLUSYIITaABwAHgAgAFIiAGOBZIBAjExmAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=K73uY5PLEba2-LYP_-2EgA0&bih=916&biw=845&rlz=1C1CHBF_enUS948US948#imgrc=668JN1bA7GRZPM",
        },
        {
          reviewId: 3,
          url: "https://www.google.com/search?q=colorado+ranch+stock+photos+&tbm=isch&ved=2ahUKEwj70Jr-mZv9AhU_2MkDHWUuAekQ2-cCegQIABAA&oq=colorado+ranch+stock+photos+&gs_lcp=CgNpbWcQAzIECCMQJ1CjC1i4F2CTGWgCcAB4AIABuAGIAc4CkgEDMy4xmAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=Sb3uY7uIDr-wp84P5dyEyA4&bih=916&biw=845&rlz=1C1CHBF_enUS948US948#imgrc=3LP4FeOAgPFG1M&imgdii=5Tuw5C4nxw-99M",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, {}, {});
  },
};
