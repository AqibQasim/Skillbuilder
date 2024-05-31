
const dataSource = require("../../Infrastructure/postgres");
const cartItemRepository = dataSource.getRepository('CartItem');

async function create(payload) {
    try {

        const create = cartItemRepository.create(payload);
        const result = await cartItemRepository.save(create);
        return result;
    } catch (error) {
        console.error('Error adding courses to cart:', error);
        return { success: false, message: 'Failed to add courses to cart' };
    }
}


async function findByUserId(id) {
    try {
        const connection = dataSource;
        const cartRepository = connection.getRepository("CartItem");
        const cartItems = await cartRepository.find({ where: { id } });
        return cartItems;
    } catch (error) {
        throw error;
    }
}



async function remove(id) {
    try {
        const cartRepository = dataSource.getRepository("CartItem");
        return cartRepository.delete(id);
    } catch (error) {
        throw error;
    }
}

module.exports = { create, findByUserId, remove };
