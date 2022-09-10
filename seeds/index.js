const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console.log("Connection Error!!!")));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "63016c0951d67954c7850dd0",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, vel aut pariatur officia soluta corporis nostrum eveniet doloribus, ea molestiae quam? Deleniti non neque enim eum, qui dolorem! Nihil, recusandae.",
            price,
            images: [
                {
                    url: "https://res.cloudinary.com/dmmrhncno/image/upload/v1661869195/YelpCamp/qrw5004ewqvpivdoxbf0.png",
                    filename: "YelpCamp/qrw5004ewqvpivdoxbf0",
                },
            ],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
