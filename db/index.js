const Sequelize = require('sequelize');
const sq = new Sequelize(
    process.env.DBDATABASE, 
    process.env.DBUSER, 
    process.env.DBPASSWORD, {
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        dialect: 'postgres',

        define: {
            timestamps: false
        }
    },
    
);

sq.authenticate()
.then(() => {
    console.log("Sequelize connected to database");
})
.catch(err => {
   console.error('Unable to connect to the database:', err);
});

module.exports = sq;

