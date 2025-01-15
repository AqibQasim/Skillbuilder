const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    target: "live-session-payments",
    name: "live-session-payments",
    tableName: "live-session-payments",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        student_id: {
            type: "int",
        },
        instructor_id: {
            type: "int",
            nullable: true,
        },
        amount: {
            type: "int",
            default: 25
        },
        course_id:{
            type: "int",
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        student: {
            target: "User",
            type: "one-to-one",
            //inverseSide: "carts",
            joinColumn: {
                name: "student_id",
                referencedColumnName: "id",
            },
        },
        instructor: {
            target: "Instructor",
            type: "one-to-one",
            //inverseSide: "carts",
            joinColumn: {
                name: "instructor_id",
                //referencedColumnName: "id",
            },
        },
        course:{
            target:"live-course",
            type:"one-to-one",
            joinColumn:{
                name:"course_id"
            }
        }
    },
});
