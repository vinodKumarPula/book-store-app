module.exports = (sequelize, type) => sequelize.define('genres', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title:{
      type: type.STRING,
      allowNull: false,
      unique: 'my_genre'
    },
    bookId: {
          type: type.INTEGER,
          unique: 'my_genre'
      }
   });
