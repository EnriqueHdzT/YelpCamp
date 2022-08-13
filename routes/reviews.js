const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/expressError");
const asyncWrap = require("../utils/asyncWrap");

const { reviewSchema } = require("../schemas.js");

const Campground = require("../models/campground");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post(
    "/",
    validateReview,
    asyncWrap(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", "Created New Review");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:reviewId",
    asyncWrap(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Successfully Deleted Review");
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;