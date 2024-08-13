const {
  purchaseCourseDetailsRepository,
} = require("../repositories/purchasedCourseRepository");
const { findUserById } = require("../services/userService");

const getPurchasedCoursesByUserIdController = async (req, res) => {
  const user_id = req.params.user_id;
  const isUserExist = await findUserById(user_id);

  if (isUserExist == null) {
    res.status(404).send({
      status: 404,
      message: "user not found",
    });
  } else {
    // res.status(200)
    // .send({
    //     status: 200,
    //     message:"user found"
    // })
    const purchasedCourseResult = await purchaseCourseDetailsRepository(
      user_id
    );

    if (purchasedCourseResult == null) {
      res.status(200).send({
        status: 200,
        message: "no courses purchased yet",
        data: [],
      });
    } else {
      res.status(200).send({
        status: 200,
        message: "courses successfully fetched",
        data: purchasedCourseResult,
      });
    }
  }
};

module.exports = {
  getPurchasedCoursesByUserIdController,
};
