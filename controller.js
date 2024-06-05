const config = require('./config');
const nodemailer = require('nodemailer');
const db = config.pool;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const controller = {
    signup : async(req,res) => {
        try{
            const {organisation_name,name, mobile_number,email,password, address} = req.body;            
                 const verifyEmail = 'select * from users where email = ?';                
              db.query(verifyEmail,[email], async (error,result)=>{
                if(error){
                    console.log(error)
                    res.status(500).json({'Error' : error})
                }              
                    if(result.length != 0){                       
                        res.status(409).json({'message :' : "This Email was Already Exist"})
                    }else{
                        const passwordHash = await bcrypt.hash(password,10)
                        const query = 'insert into users (origanisation_name, name, mobile_number,email,password, address) values (?,?,?,?,?,?)';
                        db.query(query,[organisation_name, name, mobile_number,email,passwordHash, address],async (error, result)=>{
                            if(error){   
                                console.log(error)                             
                                res.status(500).json({'Error :' : error})
                            }else{  
                                console.log(result)                             
                                res.status(200).json({Message : 'Signup Compleated Successfully',result})
                            }
                        })
                    }
                 });         
             
        }catch(error){
            res.send(error)
        }
    },

    signin : async(req,res)=>{
        const {email, password} = req.body;
      const user = 'select * from users where email = ?'
      db.query(user, [email], async (error, result)=>{
        if(error){
            res.status(500).json({'Error' : error})
        }
        
        if(result.length == 0){
            res.status(505).json({'message' : 'Email Not Found'})
        }else{
            const passwordMatch = await bcrypt.compare(password, result[0].password);
           if(!passwordMatch){
            res.status(401).json({'Message' : "Invalid Password"})
           }else{
            res.status(200).json({Message : "User Loggedin Successfully"})
           }
        }
      })

    },

    observation : async(req,res)=>{
        const { location,problem,target,status,persion,corrction,action} = req.body;
      
        const query = 'insert into observation (location,problem,target,statuss,persion,corrction,actions) values (?,?,?,?,?,?,?)';     
        db.query(query,[location,problem,target,status,persion,corrction,action],async (error, result)=>{
           
        })
    },
    getobservation : async(req,res)=>{
       
       
        const query = 'select * from observation';     
        const resp = db.query(query,async (error, result)=>{
            res.json({"result" : result})        
        })
    },
    
    createLink : async (req, res)=>{
        const {email} = req.body;
      
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query,[email], async(error, result)=>{
            if(error){
                res.status(500).json({Error : error});
            }else if(result.length === 0){
               
                res.status(505).json({Message : "Email Not Found"});
            }else{
            const token = await crypto.randomBytes(32).toString('hex');
            const date = new Date();
            const linkExpiryTime = new Date(date.getTime()+ 10*60000);
            // console.log(date);
            // console.log(linkExpiryTime);
            const addToken = "UPDATE users SET token = ?, linkExpiryTime = ? WHERE email = ?";
            db.query(addToken,[token,linkExpiryTime,email], async(error, result)=>{
                if(error){
                    res.status(500).json({Error : error});
                }
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                 auth: {
                   user: config.USER_EMAIL,
                    pass: config.USER_PASSWORD
                      }
                });
        
                var mailDetails = {                    
                    to : `${email}`,
                    from : config.USER_EMAIL,
                    subject : "Password Reset Link",
                    html : `<p>To reset your passwod 
                    <a href="${config.BASE_URL}/new-password/${token}">click here</a> </p> `
                }
              await transporter.sendMail(mailDetails);
              res.status(200).send('Password reset link sent successfully');
            })
        }
        })
        
    },

    setNewPassword : async (req,res)=>{
        const token = req.params.token;
       
        const id = "SELECT id FROM users WHERE token = ?";
        db.query(id,[token],async(error,result)=>{
        
            if(error){
                res.status(500).json({Error : error});
            }else if(result.length === 0){
                res.status(400).json({"Message" : "Invalid link"});
            }else{
                const date = new Date()
                if(result[0].linkExpiryTime < date){
                    res.status(400).json({"Message" : "Link was expired"});
                }else{
                    const {password} = req.body;
                    const passwordHash = await bcrypt.hash(password,10)
                    const newPassword = "UPDATE users SET password = ? WHERE id= ?";
                    db.query(newPassword,[passwordHash,result[0].id], async(error,result)=>{
                       
                        if(error){
                            res.status(500).json({Error : error});
                        }else if(result.length != 0){
                            res.status(200).json({Message : "Password changed successfully"});
                        }
                    })
                }
            }
        })       

    }
};

module.exports = controller;