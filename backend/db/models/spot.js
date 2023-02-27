"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        as: "Owner",
        foreignKey: "ownerId",
      });
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        hooks: true,
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        hooks: true,
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        hooks: true,
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Spot",
      defaultScope: {
        include: [
          {
            association: "SpotImages",
            required: false,
            where: { preview: true },
            attributes: [],
          },
          {
            //gotta include the models in order for fn to recognize the columns
            association: "Reviews",
            required: false,
            attributes: ["id", "review", "stars"],
          },
        ],

        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "description",
          "price",
          "createdAt",
          "updatedAt",
          [
            sequelize.fn(
              "COALESCE",
              sequelize.col("SpotImages.url"),
              sequelize.literal("'image preview unavailable'")
            ),
            "previewImage",
          ],
          [
            sequelize.fn(
              "COALESCE", //first non null value
              sequelize.fn("AVG", sequelize.col("Reviews.stars")),
              sequelize.literal("'0'")
            ),
            "avgStarRating",
          ],
        ],
      },
      scopes: {
        allDetails: {
          include: [
            {
              //gotta include the models in order for fn to recognize the columns
              association: "Reviews",
              required: false,
              attributes: ["id", "review", "stars"],
            },
            {
              association: "SpotImages",
              required: false,
              where: { preview: true },
              attributes: ["id", "url", "preview"],
            },
            {
              association: "Owner",
              required: false,
              attributes: ["id", "firstName", "lastName"],
            },
          ],
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",
            [
              sequelize.fn(
                "COALESCE", //first non null value
                sequelize.fn("COUNT", sequelize.col("Reviews.id")),
                0
              ),
              "numReviews",
            ],
            [
              sequelize.fn(
                "COALESCE", //first non null value
                sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                sequelize.literal("'0'")
              ),
              "avgStarRating",
            ],
            [
              sequelize.fn(
                "COALESCE",
                sequelize.col("SpotImages.url"),
                sequelize.literal("'image preview unavailable'")
              ),
              "previewImage",
            ],
          ],
        },
        reviewCurrentUserScope: {
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",
          ],
          group: [Spot.id],
        },
      },
    }
  );
  return Spot;
};
