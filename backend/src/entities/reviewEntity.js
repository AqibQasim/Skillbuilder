const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    target: 'Review',
    name: "Review",
    tableName: "review",
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
        comment: {
            type: "varchar",
        },
        rating: {
            type: "decimal",
            precision: 3,
            scale:1
        },

        date: {
            type: "timestamp",
        },

        instructor_id: {
            type: "int",
        },
        user_id: {
            type: "int",
        },
    },
    relations: {
        instructor: {
            target: "Instructor",
            type: "many-to-one",
            joinColumn: { name: 'instructor_id' },
        },
        user: { 
            target: "User", 
            type: "many-to-one", 
            joinColumn: { name: 'user_id' }, 
        },
    },
});