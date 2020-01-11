module.exports = (sequelize, type) => sequelize.define('users', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: type.STRING,
      allowNull: false,
      unique: 'uniqueTag',
    },
    password: {
      type: type.STRING,
      allowNull: false
    }
});


//,
//    resetPasswordToken: type.STRING,
 //   resetPasswordExpires: type.DATE,