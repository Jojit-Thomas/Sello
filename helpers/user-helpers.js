const { USER_COLLECTION } = require("../config/collections");
const { get } = require("../config/connection");
const bcrypt = require("bcrypt");
module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response ={}
      get().collection(USER_COLLECTION).findOne({username:userData.username}).then((data) => {
        if (data) {
          response.status = false;
          response.error = "Username already registered";
          resolve(response)
        } else {
          bcrypt.hash(userData.password, 10).then((result) => {
            userData.password = result;
            delete userData.confirmPassword;
            get()
              .collection(USER_COLLECTION)
              .insertOne(userData)
              .then((data) => {
                response.data = data.insertedId;
                response.status = true;
                resolve(response);
              });
          });
        }
      })
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await get()
        .collection(USER_COLLECTION)
        .findOne({ username: userData.username });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },
  // updateUser: (userData) => {
  //   return new Promise(async (resolve, reject) => {
  //     get().collection(USER_COLLECTION).updateOne(userData)
  // }
};
