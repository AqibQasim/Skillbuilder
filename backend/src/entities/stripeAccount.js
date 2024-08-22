const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'account_reg_ids',
    tableName: 'account_reg_ids',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        user_id: {
            type: "int"
        },
        instructor_id : {
            type: "int"
        },
        account_reg_id: {
            type : "varchar"
        }
    },
    relations:{
        user:{
            target:"User",
            type:"one-to-one",
            joinColumn:{
                name:"user_id",
                referencedColumnName:"id"
            }
        },
        instructor:{
            target:"Instructor",
            type:"one-to-one",
            joinColumn:{
                name:"instructor_id",
                referencedColumnName:"id"
            }
        }
    }
});
