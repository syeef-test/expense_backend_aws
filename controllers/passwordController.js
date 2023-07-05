// const sequelize = require("../util/database");
const passwordService  = require("../services/mongoPasswordService");


exports.forgotPassword = async (req, res, next) => {
    try{
        const data = await passwordService.forgotPassword(req.body.email);
        if (data.success){
            return res.status(200).json(data);
        }else{
            return res.status(401).json(data);
        }
    }catch(error){
        console.log(error);
    }
    
};

exports.checkPasswordLinkStatus = async (req, res, next) => {
    try{
        const data = await passwordService.checkPasswordLink(req.params.uuid);
        if (data){
            return res.status(200).send(data);
            res.end();
        }else{
            res.status(401).json({ message: "No Email Link Send", success: false });
        }
    }catch(error){
        console.log(error);
    }
    
};

exports.updatepassword = async (req, res, next) => {
    try{
        const newpassword = req.query.newpassword;
        const reqpasswordid = req.params.resetpasswordid;
        const data = await passwordService.updateNewPassword(reqpasswordid,newpassword);
        console.log(data);
        if (data.success){
            return res.status(200).json(data);
        }else{
            return res.status(401).json(data);
        }
    }catch(error){
        console.log(error);
    }
    
};
