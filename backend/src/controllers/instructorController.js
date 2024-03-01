const { createInstructor,ReadInstructors,ReadInstructor, getInstructorWithSkillss} = require('../services/instructorService');
const {logger}=require('../../logger');

// const { getInstructorWithSkillss } = require("../services/instructorService");

const fetchInstructorWithSkills = async (req, reply) => {
  try {
    const { id } = req.params;
    logger.info("checkinggggggggggggg");
    const instructorWithSkills = await getInstructorWithSkillss(id);
    reply.send(instructorWithSkills);
  } catch (error) {
    reply.code(500).send(error.message);
  }
};


    const postInstructor= async(req,reply )=>{  
    const data=req.body
    try{    
        const instructor=await createInstructor(data);
        reply.send(instructor);

    }catch(err){
        reply.code(500).send(err);

    }

    }

    // const getInstructors= async(req,reply )=>{  
    //     try{

    //         const instructor=await ReadInstructors();
    //         reply.send(instructor);
    
    //     }catch(err){
    //         reply.code(500).send(err);
    
    //     }
    
    //     }

    const getInstructors = async (req, reply) => {
        try {
            const instructors = await ReadInstructors();
            reply.send(instructors);
        } catch (err) {
            reply.code(500).send(err);
        }
    }
//        const updateInstructor= async(req,reply )=>{
//         const data=req.body
//         try{    
//             const instructor=await UpdateInstructor(data);
//             reply.send(instructor);
    
//         }catch(err){
//             reply.code(500).send(err);
    
//         }  
// }        
        
//             const deleteInstructor= async(req,reply )=>{
//             const data=req.body
//             try{    
//                 const instructor=await DeleteInstructor(data);
//                 reply.send(instructor);
        
//             }catch(err){
//                 reply.code(500).send(err);
        
//             }

// }
        const getInstructor= async(req,reply )=>{
        const {id}=req.params;
        try{    

        const instructor=await ReadInstructor(id);
        reply.send(instructor);

        }catch(err){
        reply.code(500).send(err);

        }

    }

    module.exports={postInstructor,getInstructors,getInstructor,fetchInstructorWithSkills};
