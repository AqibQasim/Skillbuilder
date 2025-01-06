const validateSearchQuery= (req,res,next)=>{
    const {value,searchBy}= req?.query;
    if(!value || !searchBy){
        return res.status(400).send({
            status: 400,
            message:"value and/or search by is required",
        })
    }

    if(searchBy!=="course"){
        return res.status(400).send({
            status: 400,
            message: "search can only be implemented via course"
        })
    }

    next();
}

module.exports= validateSearchQuery;