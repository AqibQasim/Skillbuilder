const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Order',
    tableName: 'orders',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        user_id: {
            type: 'int',
        },
        status: {
            type: 'varchar',
        },
        total_amount: {
            type: 'decimal',
        },
        currency: {
            type: 'varchar',
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
        },
        updated_at: {
            type: 'timestamp',
            updateDate: true,
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: { name: 'user_id' },
        },
        items: {
            target: 'OrderItem',
            type: 'one-to-many',
            inverseSide: 'order',
            cascade: true,
        },
    },
});


