const { ObjectId } = require("mongodb");
const { PRODUCT_COLLECTION } = require("../config/collections");
const { get } = require("../config/connection");

module.exports = {
  addProduct: (product, callback) => {
    get()
      .collection("product")
      .insertOne(product)
      .then((data) => {
        // console.log((data.insertedId).toString())
        callback(data.insertedId);
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await get()
        .collection(PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  deleteProducts: (id) => {
    return new Promise(async (resolve, reject) => {
      get()
        .collection(PRODUCT_COLLECTION)
        .deleteOne({ _id: ObjectId(id) })
        .then((data) => {
          resolve(true);
        });
    });
  },
  getProducts: (id) => {
    return new Promise((resolve, reject) => {
      get().collection(PRODUCT_COLLECTION).findOne({ _id: ObjectId(id)})
    }).then((data) => {
      resolve(data);
    });
  },
  editProduct: (id) => {},
};
