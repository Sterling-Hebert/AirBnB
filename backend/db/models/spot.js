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
            association: "Reviews",
            required: false,
            attributes: [],
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
              "COALESCE",
              sequelize.fn("AVG", sequelize.col("Reviews.stars")),
              0
            ),
            "avgRating",
          ],
        ],
        group: ["Spot.id", "SpotImages.url"], //required by postgres
      },
      scopes: {
        iHateScopes: {
          //use for GetAllSpots queryScope
          include: [
            {
              association: "Reviews",
              required: false,
              attributes: [],
            },
            {
              association: "SpotImages",
              required: false,
              attributes: ["id", "url", "preview"],
            },

            {
              association: "Owner",
              required: false,
              attributes: ["id", "firstName", "lastName"],
            },
          ],
          attributes: [
            [
              sequelize.fn(
                "COALESCE",
                sequelize.fn("COUNT", sequelize.col("Reviews.id")),
                0
              ),
              "numReviews",
            ],
          ],
          group: ["Spot.id", "SpotImages.id", "Reviews.id", "Owner.id"], //required by postgres
        },
        reviewCurrentUserScope: {
          //use for review and booking
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
          group: ["Spot.id"], //required by postgres
        },
      },
    }
  );
  return Spot;
};
