const passport = require('passport');
const Model = require('../modelStore');
const sequelize= require('sequelize');

function formatError(err,type){
  console.log('Insidne formatError',err.original,type)
  if(err && err.original && err.original.code=='ER_DUP_ENTRY')
  return type=='Author'?'Author Already Exists':err.original.message.split("'")[1].split('-')[0]+' already Exits';
return err;
}


async function addGenre(genres, bookId, transaction) {
  try {
    for (let genre of genres) {
      let d = await Model.Genres.create({
        title: genre,
        bookId: bookId
      }, {
        transaction
      })
      console.log('Genere;', d.id)
    }
  } catch (err) {
    throw Error(formatError(err,'Genre'))
  }
}

async function addAuthor(authors, bookId, transaction) {
  try {
    console.log('authorss****',authors)
    for (let author of authors) {
      let auth = await Model.Authors.findOne({
       where: {name: author}
      }, {
        transaction
      })
      console.log('Author afte finnd',author)
      if (!auth)
        auth = await Model.Authors.create({
          name: author
        }, {
          transaction
        })
      await Model.BookAuthor.create({
        authorId: auth.id,
        bookId: bookId
      }, {
        transaction
      })
    }
  } catch (err) {
        throw Error(formatError(err,'Author'))
  }
}

async function deleteAuthors(authors,bookId,transaction){
try{
    await Model.BookAuthor.destroy({where :{authorId:{[sequelize.Op.in]:authors},bookId:bookId}},{transaction})    
    let otherAuthors= await Model.BookAuthor.findAll({attributes: ['authorId'],where :{authorId:{[sequelize.Op.in]:authors}}},{transaction})  
    otherAuthors.forEach(auth=>{
            delete authors.indexOf(auth.authorId)
    });
    await Model.Authors.destroy({where:{id:{[sequelize.Op.in]:authors}}},{transaction});
}catch(err){ throw Error(err)}
}

async function updateAuthors(authors,bookId,transaction){
  try{
  
  if(authors.add && authors.add.length>0){
    await addAuthor(authors.add,bookId,transaction)
  }
  if(authors.delete && authors.delete.length>0){
    await deleteAuthors(authors.delete,bookId,transaction)
  }
}catch(err){
       throw Error(formatError(err,'Author'))
  }
}

async function updateGenre(genres,bookId,transaction){
try{
  if(genres.add && genres.add.length>0){
    await addGenre(genres.add,bookId,transaction)
  }
if(genres.delete && genres.delete.length>0){
    let deleteGenre=await Model.Genres.destroy({where :{id:{[sequelize.Op.in]:genres.delete}}},{transaction})    
  }
if(genres.update && genres.update.length>0){
    for(let update of genres.update){
       let updated= await Model.Genres.update({title:update.title}, {where:{id:update.id,bookId:bookId}},{transaction})
    }
}
}catch(err){
  console.log('err in Genere',err)
      throw Error(formatError(err,'Genre'))
  }
}


async function addBook  (body,user,res) {
let transaction;    
try {
  transaction = await Model.sequelize.transaction();
  const bookInfo = await  Model.Books.create({title:body.title,userId:user.id},{transaction})
  const genreInfo=await addGenre(body.genres,bookInfo.id,transaction)
  await addAuthor(body.authors,bookInfo.id,transaction)
  await transaction.commit();
  return res.status(200).send({Sucess:true})
} catch (err) {
    err= formatError(err,'Book Title')
   if (transaction) await transaction.rollback();  
    return res.status(406).send({Sucess:false,reason:err.toString()})
}
}

async function editBooks(body,user,res){
  let transaction;
  try {
    try{
    await ownerShipCheck(body.bookId,user)
  }catch(er){ 
    return  res.status(403).send({Sucess:false,reason:'UnAuthorized or Book Doesnt belongs to User'});
  }
  transaction = await Model.sequelize.transaction();
  if(body.title)
    await Model.Books.update({title:body.title.title},{where:{id:body.title.id}},{transaction})
  if(body.authors)
  await updateAuthors(body.authors,body.bookId,transaction)
 if(body.genres)
   await updateGenre(body.genres,body.bookId,transaction)
     await transaction.commit();
      res.status(200).send({Sucess:true})
    }  
    catch (err) {
        err= formatError(err,'Book Title')
  if (transaction) await transaction.rollback();
    return res.status(406).send({Sucess:false,reason:err.toString()})
    }
}


async function addAuthorToUser(body,user,res){
  let transaction;    
try {
        try{
    await ownerShipCheck(body.bookId,user)
  }catch(er){ return  res.status(403).send({Sucess:false,reason:'UnAuthorized or Book Doesnt belongs to User'});}
  transaction = await Model.sequelize.transaction();
  console.log('body**',body.authors)
      await addAuthor(body.authors,body.bookId,transaction)
     await transaction.commit();
      res.status(200).send({Sucess:true})
    }  
    catch (err) {
     if (transaction) await transaction.rollback();
      return res.status(406).send({Sucess:false,reason:err.toString()})
    }
  }

async function getBooks(body,user,res){
  try{
    let requiredOut=[];
    let userAuthors=[]
   const booksInfo= await Model.Books.findAll({where :{userId:user.id}})
   for(let book of booksInfo){
      const genres=await Model.Genres.findAll({attributes: ['title','id'],where :{bookId:book.id}})
      let authorIds=await Model.BookAuthor.findAll({attributes: ['authorId'],where :{bookId:book.id}})
      const authors=await Model.Authors.findAll({attributes: ['name','id'],where :{id:{[sequelize.Op.in]:authorIds.map(key=>key.authorId)}}})
      console.log('**********',authors)
      requiredOut.push({title:book.title,genres:genres,authors:authors,id:book.id});
      authors.forEach(key=>{ if(userAuthors.indexOf(key.name)==-1) userAuthors.push(key.name)})
      // userAuthors=userAuthors.concat(authors)
   }
   return res.status(200).send({Sucess:true,books:requiredOut,authors:userAuthors})
  }catch(err){
    console.log('err**',err)
     return res.status(406).send({Sucess:false,reason:err.toString()})
  }
}

async function ownerShipCheck(bookId,user,res){
 try{
 const hasRecord= await Model.Books.findOne({where:{id:bookId,userId:user.id}})
  if(!hasRecord)
    throw Error(JSON.stringify({error:'Invalid BookId or BookId is not belongs to User'}))
  return
}catch(err){
  console.log('err',err)
    throw Error(JSON.stringify({error:'Invalid BookId or BookId is not belongs to User'}))
}
}

module.exports = (app) => {
  app.get('/books', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
  // console.log('BOOKS',info.message)
        return res.status(401).send(info.message);

      }
        // console.log(info.message);        
        return getBooks({},user,res)
      Model.Books.findAll({
          where: {
            userId: user.id
          },
        }).then((userInfo) => {
          if (userInfo.length != 0) {
            console.log('user found in db from findUsers',userInfo);
            res.status(200).send({
              auth: true,
              email: userInfo.email,
              username: userInfo.username,
              password: userInfo.password,
              message: 'user found in db',
            });
          } else {
            console.error('no books exists in db with that username');
            res.status(401).send('no books available');
          }
        });
    })(req, res, next);
  });
  app.post('/books',(req,res,next)=>{
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
        return res.status(401).send(info.message);
      } 
       addBook(req.body,user,res)
    })(req, res, next);
  })
  app.put('/books/author',(req,res,next)=>{
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {

        return res.status(401).send(info.message);
      }
       addAuthorToUser(req.body,user,res)
    })(req, res, next);
  })
  app.put('/books',(req,res,next)=>{
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
        return res.status(401).send(info.message);
      } 
       editBooks(req.body,user,res)
    })(req, res, next);
  })
};