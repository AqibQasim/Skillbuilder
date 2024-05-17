const cartItemRepository = require("../repositories/cartItemRepository");



async function addToCart(userId, courseId) {
    try {
        // const isCourseAlreadyPurchased = await 
        const payload = {
            user_id: userId,
            course_id: courseId
        }
        await cartItemRepository.create(payload);
        console.log("userID >>>>>>>>>>>>>.", userId, "courseid >>>>>>>", courseId);
        return { success: true, message: `Course with id ${courseId} added to cart successfully` };
    } catch (error) {
        console.error('Error adding course to cart:', error);
        return { success: false, message: 'Failed to add course to cart' };
    }
}


async function getCartItem(id) {
    try {
        const cartItems = await cartItemRepository.findByUserId(id);
        return cartItems;
    } catch (error) {
        throw error;
    }
}


async function removeCartItem(id) {
    try {
        const result = await cartItemRepository.remove(id);
        return result; // Return the DeleteResult object
    } catch (error) {
        throw error;
    }
}

module.exports = { addToCart, getCartItem,  removeCartItem };
