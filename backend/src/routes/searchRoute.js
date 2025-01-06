const search = require("../controllers/searchController");
//const validateSearchQuery = require("../Schema/searchSchema");

const searchRoutes = async (fastify, options) => {
    fastify.get('/search',search);
}

module.exports= searchRoutes;