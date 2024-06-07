const mongoose  = require('mongoose');
const app = require('./app');
const config = require('./config');

app.listen(config.PORT, ()=>{
   
    console.log(`Server connected port on ${config.PORT}`);

    mongoose.connect(config.MONGODB_URI) 
    try{
      console.log("Successfully connected to database");
  }catch{
      console.log("Error while connecting the server");
     }   
   
})