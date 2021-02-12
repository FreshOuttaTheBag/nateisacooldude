const Sequelize = require ('sequelize');
const db = require('./index');


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
        allowNull: false,

    }
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
})

module.exports = { Post, User };