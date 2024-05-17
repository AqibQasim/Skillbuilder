const { addToCart, getCartItem, removeCartItem,  } = require("../services/cartItemService");
const { addToCartSchema } = require("../Schema/cartSchema")

async function create(request, reply) {
    try {
        // Validate request body
        // const { error } = addToCartSchema.validate(request.body);
       

        const { userId, courseId } = request.body;
        const cartItem = await addToCart(userId, courseId);

        reply.code(200).send(cartItem);
    } catch (error) {
        reply.code(500).send({ error: 'Internal Server Error' });
    }
}


async function get(request, reply) {
    try {
        const id = request.params.id;
        const cartItems = await getCartItem(id);
        console.log("cartItems List >>>>>>>>>>>>>>", cartItems);
        if (!cartItems || cartItems.length === 0) {
            reply.code(404).send({ error: 'Cart items not found for the user' });
        } else {
            reply.send(cartItems);
        }
    } catch (error) {
        console.error('Error getting cart items:', error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
}



async function remove(request, reply) {
    try {
        const id = parseInt(request.params.id); // Ensure ID is parsed as integer
        const result = await removeCartItem(id);
        if (result.affected === 0) {
            reply.code(404).send({ error: 'CartItem not found' });
        } else {
            reply.code(204).send({ message: 'CartItem deleted successfully' });
        }
    } catch (error) {
        reply.code(500).send({ error: 'Internal Server Error' });
    }
}


module.exports = { create, get, remove };
