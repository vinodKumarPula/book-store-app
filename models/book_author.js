module.exports = (sequelize, type) => sequelize.define('book_authors', {
    bookId: {
      type: type.INTEGER,
      primaryKey: true,
      unique: 'my_book_author'
     },
      authorId:{
      type: type.INTEGER,
      primaryKey: true,
      unique: 'my_book_author'
    }
  });