const Sequelize = require ('sequelize');
const db = require('./index');

const Post = db.define('Posts', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    title: Sequelize.STRING(100),
    url: Sequelize.TEXT,
    content: Sequelize.STRING(1000),
    user_id: {
        type: Sequelize.BIGINT,
        references: 'Users',
        referencesKey: 'id',
        allowNull: false
    }
});

const User = db.define('Users', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(100),
        unique: true,
    },
    hash: Sequelize.TEXT
});

module.exports = { Post, User };