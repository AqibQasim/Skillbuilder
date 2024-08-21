const orderRepository = require("../repositories/orderRepository");
const orderItemRepository = require("../repositories/orderItemRepository");
const courseRepository = require("../repositories/courseRepository"); // Assuming a repository for courses
const dataSource = require("../../Infrastructure/postgres");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = async (userId, course) => {
  let totalAmount = 0;
  const totalPrice = course.price * course.quantity; // Assuming the amount property represents the price of the course
  totalAmount += totalPrice;
  console.log(userId);
  const orderCreate = {
    user_id: userId,
    status: "pending",
    total_amount: totalAmount,
    currency: "usd",
  };

  console.log(orderCreate);

  const order = orderRepository.create(orderCreate);
  console.log("order create >>>>>>>>>>>++++++++++++");
  await orderRepository.save(order);

  const c = await dataSource
    .getRepository("Course")
    .findOneBy({ id: course.course_id }); // Using findOne to find a course by ID
  if (!c) {
    return `Course with ID ${item.courseId} not found`;
  }

  const orderItem = orderItemRepository.create({
    order_id: order.id,
    course_id: course.course_id,
    quantity: course.quantity,
    price: totalPrice,
  });
  console.log("Order details +++++++++", orderItem);
  await orderItemRepository.save(orderItem);
};

async function createOrderService(userId, items) {
  const orderCreate = {
    user_id: userId,
    status: "pending",
    total_amount: 0,
    currency: "usd",
  };
  const order = orderRepository.create(orderCreate);
  console.log("order create >>>>>>>>>>>++++++++++++");
  await orderRepository.save(order);

  let totalAmount = 0;
  for (const item of items) {
    const course = await courseRepository.findOneById(item.course_id); // Using findOne to find a course by ID
    if (!course) {
      return `Course with ID ${item.courseId} not found`;
    }

    const totalPrice = course.amount * item.quantity; // Assuming the amount property represents the price of the course
    totalAmount += totalPrice;

    const orderItem = orderItemRepository.create({
      order_id: order.id,
      course_id: course.id,
      quantity: item.quantity,
      price: totalPrice,
    });
    console.log("Order details +++++++++", orderItem);
    await orderItemRepository.save(orderItem);
  }

  order.total_amount = totalAmount;
  await orderRepository.save(order);

  return order;
}

async function getOrderService(id) {
  const order = await orderRepository.findOne({
    where: { id },
    relations: ["items", "items.course"],
  });
  return order;
}

async function initiateCheckoutService(userId, items) {
  // Fetch additional information about the courses in the items array
  const courses = await Promise.all(
    items.map(async (item) => {
      const course = await courseRepository.findOneById(item.courseId);
      if (!course) {
        throw new Error(`Course with ID ${item.courseId} not found`);
      }
      return course;
    })
  );

  // Create a new order in "pending" status
  const order = await createOrderService(userId, items);

  // Construct line items for Stripe checkout
  const lineItems = courses.map((course, index) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: course.title,
        description: course.description,
      },
      unit_amount: course.amount * 100,
    },
    quantity: items[index].quantity,
  }));

  // Create a Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:4000/complete?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
    cancel_url: `http://localhost:4000/cancel`,
  });

  console.log("session details ----------->>>>>", session);
  return session.id;
}

module.exports = {
  createOrderService,
  getOrderService,
  initiateCheckoutService,
  createOrder,
};
