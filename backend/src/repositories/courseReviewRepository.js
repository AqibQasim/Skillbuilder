const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");


const saveReview = async (data) => {
    const courseRevRep = dataSource.getRepository('courseReviews');
    const courseRep = dataSource.getRepository('course');
    const userRep = dataSource.getRepository('user');
    try {
        const {course_id, user_id} = data;
        if(course_id && user_id){
            try{
                const course = await courseRep.findOne({ where: { id: course_id } });
                if (!course) {
                    return 'Course does not exist.';
                }

                const user = await userRep.findOne({where: { id : user_id}});
                if(!user){
                    return 'Register yourself first to review a course!'
                }
            } catch (err){
                console.log('err:',err)
            }
        console.log("--------------------", data);
        const reviewCreating = courseRevRep.create(data);
        const saved = courseRevRep.save(reviewCreating);
        return 'Review has been successfully posted.';
        } 
    } catch (e) {
        console.log('ERR:', e);
    }
}

module.exports = {
    saveReview
};
