const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'OrderItem',
    tableName: 'order_items',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        order_id: {
            type: 'int',
        },
        course_id: {
            type: 'int',
        },
        quantity: {
            type: 'int',
        },
        price: {
            type: 'decimal',
        },
    },
    relations: {
        order: {
            target: 'Order',
            type: 'many-to-one',
            joinColumn: { name: 'order_id' },
        },
        course: {
            target: 'Course',
            type: 'many-to-one',
            joinColumn: { name: 'course_id' },
        },
    },
});
