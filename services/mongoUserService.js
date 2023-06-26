const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.createUser = async (user) => {
    const name = user.name;
    const email = user.email;
    const password = user.password;

    const data = await userModel.find({ 'email': email });
    //console.log(data);
    //console.log(Object.keys(data).length);
    //return await userModel.create({name:user.name,email:user.email,password:user.password});
    if (Object.keys(data).length === 0) {
        //console.log("salt");
        const saltrounds = 10;
        const hash = await bcrypt.hash(password, saltrounds);
        await userModel.create({ name: user.name, email: user.email, password: hash });
        return true;
    } else {
        return false;
    }
}

exports.loginUser = async (user) => {
    const email = user.email;
    const password = user.password;

    const data = await userModel.findOne({ 'email': email });
    console.log(data);

    if (data && Object.keys(data).length > 0) {
        const match = await bcrypt.compareSync(user.password, data.password);
        if (match) {
            return { message: "User Login Succesful", token: this.generateAccessToken(data._id, data.name, data.ispremiumuser), success: true };
        } else {
            return { message: "User Not authorized", success: false };
        }
    }else{
            return false;
    }
}

exports.generateAccessToken = (id, name, ispremiuemuser) => {
    return jwt.sign({ userId: id, name: name, ispremiuemuser: ispremiuemuser }, process.env.TOKEN_SECRET);
};












