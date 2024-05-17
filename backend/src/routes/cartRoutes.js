const { create, get,  remove } = require("../controllers/cartItemControllers")

const cartRoutes = async (fastify, options) => {

    fastify.post('/cart-items', create);
    fastify.get('/cart-items/:id', get);
    fastify.delete('/cart-items/:id', remove);
}


module.exports = cartRoutes;