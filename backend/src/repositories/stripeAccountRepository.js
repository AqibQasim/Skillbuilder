const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const accRegIdRepository = dataSource.getRepository('account_reg_ids');

const saveAccountRegId = async (payload) => {
    try {
        const creating = accRegIdRepository.create(payload);
        const result = await accRegIdRepository.save(creating);
        console.log("result of saving the account registration record: ", result);
        return "Stripe account registration id saved successfully ";
    } catch (err) {
        console.log("Err:", err);
        return err;
    }
}

const checkIfAccounRegIdExists = async (instructor_id) => {
    try{
        const result = await accRegIdRepository.find({
            where : {
                instructor_id : instructor_id
            }
        })
        console.log("result of fetching the registration record: ", result);
        return result;
    } catch (err){
        console.log("Err:", err);
        return err;
    }
}

module.exports = {
    saveAccountRegId,
    checkIfAccounRegIdExists
}