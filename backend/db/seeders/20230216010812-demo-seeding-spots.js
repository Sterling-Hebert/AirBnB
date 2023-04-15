"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";

    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 3,
          address: "1212 Ham Drive",
          city: "Miami",
          state: "Florida",
          country: "United States",
          lat: 21,
          lng: 24,
          name: "Miami Beach Resort",
          description: "Beach resort off the south tip of Miami",
          price: 22,
        },
        {
          ownerId: 1,
          address: "1313 London Lane",
          city: "London",
          state: "United Kingdom",
          country: "England",
          lat: 42,
          lng: 46,
          name: "Penthouse. Roof Terrace. Shoreditch. AC",
          description:
            "Stunning 180-degree views of the London skyline from the roof terrace. Perfectly situated to explore the whole city, with Underground transport links all within a short walk.  ",
          price: 350,
        },
        {
          ownerId: 1,
          address: "1414 Colorado Cove",
          city: "Denver",
          state: "Colorado",
          country: "United States",
          lat: 11,
          lng: 32,
          name: "Luxury Townhouse in Cherry Creek North",
          description:
            "Beautifully decorated modern townhouse with bright and open floor plan, very quiet!",
          price: 230,
        },
        {
          ownerId: 1,
          address: "231 N 11th St",
          city: "Las Vegas",
          state: "Nevada",
          country: "United States",
          lat: 11,
          lng: 32,
          name: "Luxury 4-Bedroom w/ Gorgeous Views & Private Pool",
          description:
            "Golf Course Living! Built on the 12th fairway of the Las Vegas National golf course, Paradise Palms is the first mid-century modern neighborhood in Las Vegas.",
          price: 375,
        },
        {
          ownerId: 1,
          address: "34 Beverly Hills Drive",
          city: "Los Angeles",
          state: "California",
          country: "United States",
          lat: 11,
          lng: 32,
          name: "Stunning Modern Home- Studio City-Views",
          description:
            "Brand new spacious (4872 sqft) modern home with incredible views of the mountains & Los Angeles valley. Furnished w/very high end furnishings from LA, and features high ceilings, big windows, multiple decks, an office, a movie/family room, a hot tub, & an exercise room w/two Peleton bikes.",
          price: 500,
        },
        {
          ownerId: 1,
          address: "1064 Burton Avenue",
          city: "Hella",
          state: "Iceland",
          country: "Iceland",
          lat: 11,
          lng: 32,
          name: "Glass cottage with Hot tub Blár",
          description:
            "We are located on a lava desert in the south of Iceland. 5 minutes from the small town of Hella, close to all the popular attractions that southern Iceland has to offer, but also in a secret and secluded location.",
          price: 367,
        },
        {
          ownerId: 1,
          address: "3549 Traction Street",
          city: "Greenville",
          state: "South Carolina",
          country: "United States",
          lat: 11,
          lng: 32,
          name: "Ridge Runner",
          description:
            "This cabin has a wonderful game room equipped with a pool table for endless fun without ever having to leave the cabin.  It also has a great bunk style bedroom that is perfect for kids!",
          price: 210,
        },
        {
          ownerId: 1,
          address: "3456 Everette Alley",
          city: "Fort Lauderdale",
          state: "Florida",
          country: "United States",
          lat: 11,
          lng: 32,
          name: "The Cape Coral Mansion",
          description:
            "The Cape Coral Mansion is a perfect retreat for large families/groups of friends! 8 bedrooms total, incl 2 master beds. Kitchen on the 2nd floor is fully equipped with viking stove & 3 sinks.",
          price: 1210,
        },
        {
          ownerId: 1,
          address: "4354 Glory Road",
          city: "Lynchburg",
          state: "Texas",
          country: "United States",
          lat: 11,
          lng: 32,
          name: "The Ark",
          description:
            "Welcome to Kelly’s Jubilee.  Look us up online for a discount and more information on our romantic and birthday packages.  The ark was featured in Southern Living magazine.",
          price: 110,
        },
        {
          ownerId: 1,
          address: "423 Jeolla Road",
          city: "Wansan",
          state: "South Korea",
          country: "South Korea",
          lat: 11,
          lng: 32,
          name: "Korean Cabin",
          description:
            "Hanok Stay Emotional Day is located in the center of Taejo-ro, Jeonju Hanok Village. Nearby attractions (Concubine, Jeonjeon Cathedral, Gyeonggi Pre-Gyeonggi, Hyanggyo, etc.) are 5 minutes away.",
          price: 170,
        },
        {
          ownerId: 1,
          address: "456 Nicola Lane",
          city: "Poggibonsi",
          state: "Italy",
          country: "Italy",
          lat: 11,
          lng: 32,
          name: "Real fairy castle with pool ideal for wedding also",
          description:
            "Amazing panoramic Castle with big pool. The property is surrounded by vineyards and olive groves! Located In the heart of Tuscany between Florence and Siena! A train station is just 1 Km away!",
          price: 1110,
        },
        {
          ownerId: 1,
          address: "456 Jacqueline Road",
          city: "New Providence",
          state: "Bahamas",
          country: "Bahamas",
          lat: 11,
          lng: 32,
          name: "Garden House in Lyford Cay - private Pool",
          description:
            "An oasis in the world-famous Lyford Cay gated community that is the perfect getaway. Stand-alone structure within a 3/4 acre of private garden.",
          price: 1290,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  },
};
