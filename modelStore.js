const Sequelize =require('sequelize');
const UserModel =require('./models/users');
const BookModel =require('./models/books');
const GenreModel =require('./models/genres');
const AuthorModel =require('./models/authors');
const BookAuthorModel =require('./models/book_author');
const config= require('./config.json')

const sequelize = new Sequelize(config.sql.database, config.sql.user, config.sql.password, {
  host: config.sql.host,
  dialect: config.sql.connector
});

const Users = UserModel(sequelize, Sequelize);
const Books = BookModel(sequelize, Sequelize);
const Genres = GenreModel(sequelize, Sequelize);
const Authors = AuthorModel(sequelize, Sequelize);
const BookAuthor = BookAuthorModel(sequelize, Sequelize);
// const GenreModel= UserModel(sequelize, Sequelize);
// const AuthorModel = UserModel(sequelize, Sequelize);

Users.hasMany(Books,{uniqueKey: 'my_unique_book',onDelete:'CASCADE' });
Books.belongsTo(Users,{uniqueKey: 'my_unique_book'})
Books.hasMany(Genres,{ uniqueKey: 'my_genre',onDelete:'CASCADE'})
Genres.belongsTo(Books,{uniqueKey: 'my_genre'})
Books.belongsToMany(Authors,{ as: 'Writers', through: 'book_authors' })
Authors.belongsToMany(Books,{ as: 'Publishes', through: 'book_authors' })
sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('Users db and user table have been created');
});

module.exports = {Users,Books,Genres,Authors,BookAuthor,sequelize};