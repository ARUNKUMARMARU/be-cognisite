const app = require('./app');
const config = require('./config');

app.listen(config.PORT, ()=>{
   try{
    console.log(`Server connected port on ${config.PORT}`);

    config.pool.connect(config.pool, (error)=>{
       if(error){
        console.error("Error :", error)
       }else{
        console.log(`Server connected to MySQL database`)
       }
    })
   }catch(error){
    console.error('Error :', error)
   }
})