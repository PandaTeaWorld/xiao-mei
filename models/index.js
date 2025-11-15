const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

// import models by calling function
const Guild = require('./guild')(sequelize, Sequelize);
const StaffRoles = require('./staffRoles')(sequelize, Sequelize);

// Export centralized library of models
module.exports = {
    sequelize,
    Sequelize,
    Guild,
    StaffRoles,
    Embed,
};
