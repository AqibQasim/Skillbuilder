const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Payment',
    tableName: 'payments',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        order_id: {
            type: 'int',
        },
        payment_intent: {
            type: 'varchar',
        },
        amount: {
            type: 'decimal',
        },
        currency: {
            type: 'varchar',
        },
        status: {
            type: 'varchar',
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
        },
    },
    relations: {
        order: {
            target: 'Order',
            type: 'many-to-one',
            joinColumn: { name: 'order_id' },
        },
    },
});
