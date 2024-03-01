const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
    target: 'Instructor',
    name: "Instructor",
    tableName: "Instructor",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        email: {
            type: "varchar",
        },
        bio: {
            type: "varchar",
        },
        password: {
            type: "varchar",
        },
        profession: {
            type: "varchar",
        },
    },
})