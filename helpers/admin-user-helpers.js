const { USER_COLLECTION, ADMIN_CREDENTIALS } = require("../config/collections");
const { get } = require("../config/connection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
module.exports = {
  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let user = await get().collection(USER_COLLECTION).find().toArray();
      resolve(user);
    });
  },
  registerUser: (userData) => {
    return new Promise(async (resolve, reject) => {
      const { username} = userData;
      let response = {}
      get().collection(USER_COLLECTION).findOne({username: username}).then((user) => {
        if (user) {
          response.success = false;
          response.error = "Username already registered"
          resolve(response);
        } else {
          bcrypt.hash(userData.password, 10).then((result) => {
            userData.password = result;
            delete userData.confirmPassword;
            get()
              .collection(USER_COLLECTION)
              .insertOne(userData)
              .then((data) => {
                response.success = true; 
                response.data = data.insertedId;
                resolve(response);
              });
          });
        }
      })
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      get()
        .collection(USER_COLLECTION)
        .deleteOne({ _id: ObjectId(id) })
        .then((data) => {
          console.log(data.deletedId);
          resolve(data.deletedId);
        });
    });
  },
  getUserDetails: (id) => {
    return new Promise((resolve, reject) => {
      get()
        .collection(USER_COLLECTION)
        .findOne({ _id: ObjectId(id) })
        .then((user) => {
          resolve(user);
        });
    });
  },
  updateUser: (proId, proDetails) => {
    const { name, username, email, password } = proDetails;
    return new Promise(async (resolve, reject) => {
      let response = {};
      get()
        .collection(USER_COLLECTION)
        .findOne({$and:[{_id:{$ne:ObjectId(proId)}},{username:username}] })
        .then((user) => {
          if (user) {
            response.status = false;
            response.error = "Username already registered";
            resolve(response);
          } else {
            bcrypt.hash(password, 10).then((pass) => {
              get()
                .collection(USER_COLLECTION)
                .updateOne(
                  { _id: ObjectId(proId) },
                  {
                    $set: {
                      name: name,
                      username: username,
                      email: email,
                      password: pass,
                    },
                  }
                )
                .then(() => {
                  response.status = true;
                  resolve(response);
                });
            });
          }
        });
    });
  },
  doLogin: (userData) => {
    return new Promise((resolve, reject) => {
      console.log(userData);
      let response = {};
      get()
        .collection(ADMIN_CREDENTIALS)
        .findOne({ username: userData.username, password: userData.password })
        .then((user) => {
          if (user) {
            response.admin = user;
            response.status = true;
            resolve(response);
          } else {
            resolve(response);
            console.log("null", user);
          }
        });
    });
    // if (user) {
    //   bcrypt.compare(userData.password, user.password).then((status) => {
    //     if (status) {
    //       console.log("Login Success");
    //       response.user = user;
    //       response.status = true;
    //       resolve(response);
    //     } else {
    //       console.log("Login Failed");
    //       resolve({ status: false });
    //     }
    //   });
    // } else {
    //   console.log("Login Failed");
    //   resolve({ status: false });
    // }
    // },
  },
};
