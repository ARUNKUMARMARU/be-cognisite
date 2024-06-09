const config = require('./config');
const nodemailer = require('nodemailer');
const userModel = require("./models/userModel");
const observationModel = require('./models/observation')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const controller = {
    signup : async(req,res) => {
        try{
            const {organisation_name,name, mobile_number,email,password, address} = req.body;   
                   
                 const verifyEmail = await userModel.findOne({email})    
                 if (verifyEmail) {
                    return res.status(400).json({ error: 'Email already exists' });
                }else{
                    const passwordHash = await bcrypt.hash(password,10);
                    const newUser = new userModel({
                        organisation_name,
                        name, 
                        mobile_number,
                        email,
                        password : passwordHash , 
                        address
                    });
                    const savedUser = await newUser.save();
                    res.json({ message: 'user created', user: savedUser });
                }               
                           
        }catch(error){
            res.status(500).json({ error: error.message})
        }
    },

    signin : async(req,res)=>{
        const {email, password} = req.body;    
      const user = await userModel.findOne({email});
        if(!user){
            return res.json({ Message: 'user not found' });
        }        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.json({ Message: 'incorrect password' });
        }
        const token = jwt.sign({
            id: user._id,  
            email: user.email,
            name: user.name
        }, config.JWT_SECRET);

        res.json({ message: 'user signed in', token});
    },

    observation : async(req,res)=>{
        const { location,problem,target,status,persion,corrction,action} = req.body;
      const newObservation = new observationModel({
        location,
        problem,
        target,
        status,
        persion,
        corrction,
        action
      });
      
      const savedObservation = await newObservation.save();
       
           res.status(200).json({"Message" : "New Observation Stored successfully", savedObservation})
      
    },
    getobservation : async(req,res)=>{       
       
        const savedObservation = await observationModel.find({});        
            res.json({savedObservation});           
    },
    
    createLink : async (req, res)=>{
        const {email} = req.body;
      
        const verifyEmail = await userModel.findOne({email : email});
        
        if(verifyEmail == null){            
             res.json({ Message: 'Email not found' });
        } else{     
            const token = await crypto.randomBytes(32).toString('hex');
            const date = new Date();
            const linkExpiryTime = new Date(date.getTime()+ 10*60000);
           
           verifyEmail.token = token;
           verifyEmail.linkExpiryTime = linkExpiryTime;

           verifyEmail.save();
           
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
                    <a href="${config.BASE_URL}new-password/${token}">click here</a> </p>  </br>
                    <p><b>Note : </b> This link will expire in 10 Minutes</p>`
                }
              await transporter.sendMail(mailDetails);
              res.json({Message : 'Password reset link sent successfully'});    
            }    
    },

    setNewPassword : async (req,res)=>{
        const token = req.params.token;       
        const user = await userModel.findOne({token : token});
        
        if(!user){
            res.json({Message : "Invalid Token"})
        } 
        //   const date = new Date();
        //  const verifyTime = new Date(date.getTime());
        //   if(user.linkExpiryTime < verifyTime){
        //     res.status(400).json({"Message" : "Link was expired"});
        //   }
          const {password} = req.body;     
          const passwordHash = await bcrypt.hash(password,10)         
           user.password = passwordHash;   
           user.save();               
           res.status(200).json({Message : "Password changed successfully"});        
             
    }
};

module.exports = controller;