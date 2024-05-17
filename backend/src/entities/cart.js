const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    target: "CartItem",
    name: "CartItem",
    tableName: "cart_item",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        user_id: {
            type: "int",
        },
        course_id: {
            type: "int",
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        user: {
            target: "User",
            type: "one-to-one",
            inverseSide: "carts",
            joinColumn: {
                name: "userId",
                referencedColumnName: "id",
            },
        },
        course: {
            target: "Course",
            type: "many-to-one",
            inverseSide: "carts",
            joinColumn: {
                name: "courseId",
                referencedColumnName: "id",
            },
        },
    },
});
