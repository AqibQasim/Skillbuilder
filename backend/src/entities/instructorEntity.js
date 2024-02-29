const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
    target: 'User',
    name: "user",
    tableName: "user",
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
        active: {
            type: "boolean",
        },
    },
})