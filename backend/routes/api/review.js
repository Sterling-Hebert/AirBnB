const express = require("express");
const { Model } = require("sequelize");
const { Sequelize } = require(".");
const {
  User,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
  Booking,
} = require("../../db/models");
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
const { ResultWithContext } = require("express-validator/src/chain");
const router = express.Router();

//Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },

      {
        model: Spot.scope("reviewCurrentUserScope"),
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  for (let review of reviews) {
    const preview = await SpotImage.findOne({
      where: {
        spotId: review.Spot.id,
        preview: true,
      },
    });
    if (preview) {
      review.Spot.dataValues.previewImage = preview.url;
    } else {
      review.Spot.dataValues.previewImage = "No Image";
    }
  }

  res.json({ Reviews: reviews });
});

//add an image to a review based on reviewid

router.post("/:id/images", requireAuth, async (req, res) => {
  const { url } = req.body;
  const findReview = await Review.findByPk(req.params.id);
  if (!findReview) {
    return res
      .status(404)
      .json({ message: "Review couldnt be found", statusCode: 404 });
  }
  if (findReview.userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Must be owner of review to post", statusCode: 404 });
  }
  const imageReview = await ReviewImage.findAll({
    where: {
      reviewId: findReview.id,
    },
  });
  if (imageReview.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of image for this resource was reached",
      statusCode: 403,
    });
  } else {
    const image = await ReviewImage.create({
      reviewId: findReview.id,
      url: url,
    });
    const obj = {
      id: image.id,
      url: image.url,
    };
    res.json(obj);
  }
});

//edit review

router.put("/:id", requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  let updateReview = await Review.findByPk(req.params.id);
  if (!updateReview) {
    return res
      .status(404)
      .json({ message: "Review couldnt be found", statusCode: 404 });
  }
  if (updateReview.userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Must be owner of review to edit", statusCode: 404 });
  }
  updateReview.update({
    review: review,
    star: stars,
  });
  await updateReview.save();
  res.json(updateReview);
});

//delete a review

router.delete("/:id", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.id);

  if (!review) {
    res
      .status(404)
      .json({ message: "Review couldnt be found", statusCode: 404 });
  } else {
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        message: "Must be owner of review to delete",
        statusCode: 404,
      });
    }
    await review.destroy();
    res.status(200).json({ message: "Successfully deleted", statusCode: 200 });
  }
});

module.exports = router;
