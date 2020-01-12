const { Validator } = require('node-input-validator');
const Schema={'/signup': {
    email: 'required|email',
    password: 'required'
  },
 '/login': {
    email: 'required|email',
    password: 'required'
  },
 '/books-POST':{
  title:'required|regex:[a-zA-Z0-9_\s]',
  genres:'required|arrayUnique',
  'genres.*':'required|regex:[a-zA-Z0-9_\s]', 
  authors:'required|arrayUnique',
  'authors.*':'required|regex:[a-zA-Z0-9_\s]' 
}, 
'/books/author-PUT':{
  authors:'required|arrayUnique',
  'authors.*':'required|regex:[a-zA-Z0-9_\s]', 
  bookId:'required|integer'
},
 '/books-PUT':{
  title:'required|regex:[a-zA-Z0-9_\s]',
  genres:'object', 
  'genres.add': 'arrayUnique',
  'genres.add.*':'required|regex:[a-zA-Z0-9_\s]', 
   'genres.delete': 'arrayUnique',
  'genres.delete.*':'required|integer',  
  'genres.update':'arrayUnique',
  'genres.update.*':'object',
  'genres.update.*.id':'required|integer',
  'genres.update.*.title':'required|regex:[a-zA-Z0-9_\s]',
  'authors':'object',
  'authors.add':'arrayUnique',
  'authors.delete':'arrayUnique',
  'authors.delete.*':'required|integer',
  'authors.add.*':'required|regex:[a-zA-Z0-9_\s]',
  'authors.delete.*':'required|integer',
  bookId:'required|integer'

}}

async function basicValidator(body,schema) {
  if (!body)
    return {reason:'Missing Data'};
  let errorMessage={reason:'Missing Data',errors:[]}
  const v=new Validator(body,schema)
    const valid=await v.check()
     console.log('valid',valid,v.errors)
      if(valid) return false
        Object.keys(v.errors).forEach(key=>{
          errorMessage.errors.push(`Missing ${key}: ${v.errors[key].message}`)
        })
      return errorMessage
}
function sendErrorMessage(res,errors){
console.log('inside send errors')
  res.status(405).send(errors)
}


module.exports=async (req,res,next)=>{
  console.log('req',req.body,req.url,req.method)
  if(!Schema[req.url+'-'+req.method])
    return next()
  const hasError=await basicValidator(req.body,Schema[req.url+'-'+req.method])
    if(!hasError)
      return next()
    console.log('error hasError',hasError)
    return sendErrorMessage(res,hasError)
  }