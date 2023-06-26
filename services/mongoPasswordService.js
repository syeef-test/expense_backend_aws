const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const uuid = require("uuid");


const User = require("../models/userModel");
const forgotPassword = require("../models/forgotPasswordModel");

const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDING_BLUE_API_KEY;



exports.forgotPassword = async (inputEmail) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //console.log(inputEmail);
        const userDetails = await User.findOne({ email: inputEmail }).session(session);
        //console.log(userDetails);
        const uuid_data = uuid.v4();
        //console.log(uuid_data);
        // const createRequest = await forgotPassword.create({ id: uuid_data, userId: userDetails._id }).session(session);
        if (userDetails && Object.keys(userDetails).length > 0) {
            const createRequest = new forgotPassword({ id: uuid_data, userId: userDetails._id });
            await createRequest.save({ session });
        }



        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: process.env.SENDER_EMAIL,
            name: process.env.SENDER_NAME,
        };
        const receivers = [
            {
                email: inputEmail,
            },
        ];

        await session.commitTransaction();

        const link = `<a href='http://127.0.0.1:3000/password/resetpassword/${uuid_data}'>Click Here</a>`;
        const sendMail = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Reset Password at Expense Tracker",
            htmlContent: `<h1>Expense Tracker App</h1>
        <p>Click here to reset your password</p>
        ${link}`,
            params: {
                email: inputEmail,
            },
        });

        if (sendMail) {
            return { message: "Reset Email Link Sent To Your Email", success: true };
        }

        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return { message: "Reset Email Unsuccessful, No User exists with this email Id", success: false };
    }
};

exports.checkPasswordLink = async (uuid) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userData = await forgotPassword.findOne({ id: uuid }).session(session);
        //console.log(userData);
        if (userData && Object.keys(userData).length > 0) {
            if (userData.isactive) {
                //const t = await forgotPassword.updateOne({ id: uuid }, { $set: { isactive: false } }).session(session);
                const t = await forgotPassword.findOneAndUpdate({ id: uuid }, { $set: { isactive: false } }).session(session);

                //console.log(t);
                if (t) {
                    await session.commitTransaction();
                }

                return (`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="http://127.0.0.1:3000/password/updatepassword/${uuid}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
            }
        }
        session.endSession();

    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
    }
}

exports.updateNewPassword = async (reqpasswordid, newpassword) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const forgotpasswordData = await forgotPassword.findOne({ id: reqpasswordid }).session(session);
      //console.log(forgotpasswordData);
  
      if (forgotpasswordData) {
        const userData = await User.findOne({ _id: forgotpasswordData.userId }).session(session);
        //console.log(userData);
  
        if (userData) {
          const saltrounds = 10;
          const hash = await bcrypt.hash(newpassword, saltrounds);
  
          const updateUserData = await User.findOneAndUpdate(
            { _id: userData._id }, 
            { $set: { password: hash } },
            { new: true, session }
          );
          //console.log(updateUserData);
  
          await session.commitTransaction(); 
  
          session.endSession();
          return { message: 'Successfully update the new password', success: true };
        } else {
          await session.abortTransaction();
          session.endSession();
          return { error: 'No user exists', success: false };
        }
      }
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
    }
  };
  








