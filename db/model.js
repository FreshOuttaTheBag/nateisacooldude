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
        references: {
            model: User,
            key: "id"
        }
    }
});

const PostLike = db.define('PostLikes', {
    user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    post_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: Post,
            key: 'id'
        }
    }
})

User.hasMany(Post, {
    foreignKey: "user_id"
})

Post.belongsTo(User, {
    foreignKey: "user_id"
})

Post.belongsToMany(User, {
    as: "UsersThatLikedPost",
    through: {
        model: PostLike,
        unique: false,
    },
    foreignKey: "post_id"
})

User.belongsToMany(Post, {
    as: "PostsLikedByUser",
    through: {
        model: PostLike,
        unique: false,
    },
    foreignKey: "user_id"
})

module.exports = { Post, User, PostLike };