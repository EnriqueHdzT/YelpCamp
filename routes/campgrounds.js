const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/expressError");
const asyncWrap = require("../utils/asyncWrap");
const Campground = require("../models/campground");
const { isLoggedIn } = require("../middleware");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get(
    "/",
    asyncWrap(async (req, res) => {
        const campgrounds = await Campground.find();
        res.render("campgrounds/index", { campgrounds });
    })
);

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    asyncWrap(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash("success", "Successfully made a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get(
    "/:id",
    asyncWrap(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate(
            "reviews"
        );
        if (!campground) {
            req.flash("error", "Campground Not Found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    asyncWrap(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Campground Not Found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router.put(
    "/:id",
    isLoggedIn,
    validateCampground,
    asyncWrap(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        req.flash("success", "Successfully Updated Campground");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    asyncWrap(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Successfully Deleted Campground");
        res.redirect(`/campgrounds`);
    })
);

module.exports = router;
