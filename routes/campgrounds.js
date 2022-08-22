const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const { populate } = require("../models/campground");

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
        campground.author = req.user._id;
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
        const campground = await Campground.findById(req.params.id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("author");
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
    isAuthor,
    asyncWrap(async (req, res) => {
        const campground = await Campground.findById(req.params._id);
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
    isAuthor,
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
    isAuthor,
    asyncWrap(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Successfully Deleted Campground");
        res.redirect(`/campgrounds`);
    })
);

module.exports = router;
