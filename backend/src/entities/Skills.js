const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    target: 'Skills',
    name: "Skills",
    tableName: "skills",
    columns: {
        id: {
            primary: true,
            type: "int", 
            generated: true, 
            unsigned: true, 
        },
        title: {
            type: "varchar",
            length: 255,
        },
        icon: {
            type: "varchar",
        },
        instructor_id: {
            type: "int",
        },
    },
    // relations: {
    //     instructor: {
    //         target: "Instructor",
    //         type: "many-to-one",
    //         joinColumn: { name: 'instructor_id' },
    //     },
    // },
});
