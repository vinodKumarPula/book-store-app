module.exports = (sequelize, type) => sequelize.define('books', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title:{
      type: type.STRING,
      allowNull: false,
      unique: 'my_unique_book'
    },
    userId: {
          type: type.INTEGER,
          unique: 'my_unique_book'
      }
});
