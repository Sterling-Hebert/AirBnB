"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          firstName: "John",
          lastName: "Johnston",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "user1@user.io",
          username: "FakeUser1",
          firstName: "Michael",
          lastName: "Jordan",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          email: "user2@user.io",
          username: "alytarifa",
          firstName: "Alyson",
          lastName: "Tarifa",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          email: "sterling@user.io",
          username: "sterlingHebert",
          firstName: "Sterling",
          lastName: "Hebert",
          hashedPassword: bcrypt.hashSync("password"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "alytarifa", "sterlingHebert"],
        },
      },
      {}
    );
  },
};
