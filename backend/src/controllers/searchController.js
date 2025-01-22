const searchCourse = require("../services/searchService");

const search= async(req,res)=>{
    const {value,searchBy}= req?.query;
    let result=null;
    switch(searchBy){
        case 'course':
            result= await searchCourse.searchCourse(value);
            res.status(result.status).send({...result});
            break;
        case 'topic':
            console.log(value)
            result= await searchCourse.searchCourses(value);
            res.status(result.status).send({...result});
            break;
        default:
            res.status(400).send({
                status: 400,
                message: "search by required"
            });
            break;
    }
}

module.exports= search;