module.exports = (sequelize, type) => sequelize.define('authors', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
      name:{
      type: type.STRING,
      allowNull: false
    }
  });
