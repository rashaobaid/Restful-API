const { promises } = require("dns");
const fs = require("fs");
const categoriesService = require("./categories");
class products {
  data = [];
  filePath = "";
  constructor(filePath) {
    this.filePath = filePath;
  }

  readFile = () => {
    this.data = JSON.parse(fs.readFileSync(this.filePath));
  };

  writeFile = (fileData) =>
    fs.writeFileSync(this.filePath, JSON.stringify(fileData));

  getAll() {
    this.readFile();
    return Promise.resolve(this.data);
  }
  getById(id) {
    this.readFile();
    if(this.doesProductIdExist(id)){
      return Promise.resolve(this.data[id]);
    }
    return Promise.reject({err:'product not found'});
  }

  getByIdSync(id) {
    this.readFile();
    return this.data[id];
  }
  //   add new product
  creatProduct(info) {
    this.readFile();
    const newproductId = Object.keys(this.data).length + 1;
    const newproduct = { Id: newproductId, ...info };
    const Products = { [newproductId]: newproduct, ...this.data };
    this.writeFile(Products);
    return Promise.resolve(this.data);
  }

  // UPDATE product
  updateProduct(id, info) {
    this.readFile();
    if(this.doesProductIdExist(id)){
    this.data[id] = info;
    this.writeFile(this.data);
    return Promise.resolve(this.data);
    }
    return Promise.reject({err:'product not found'});
    }

  // DELETE product
  deleteProduct(id) {
    this.readFile();
    if(this.doesProductIdExist(id)){
    delete this.data[id];
    this.writeFile(this.data);
    return Promise.resolve(this.data);
    }
    return Promise.reject({err:'product not found'});
  }

  sendValidationErrorResp = (res, validation) => {
    res.status(422).send({
      message: "Validation Error",
      errors: validation.errors,
      data: null,
    });
  };

  validateProduct(product) {
    this.readFile();
    const allProductCodes = Object.values(this.data).map((v) => v.code); // get all product code

    const errors = [];
    const userKeyRegExp = /^[A-Z]{3}\-[a-z]{3}\-[0-9]{4}/;

    if (allProductCodes.includes(product.code)) {
      errors.push({ field: "code", error: "code must be unique" });
    }

    if (product.name === "" || product.name == null) {
      errors.push({ field: "name", error: "Name required" });
    }
    if (typeof product.name !== "string") {
      errors.push({ field: "name", error: "Name must be string" });
    }
    if (product.rawPrice === "" || product.rawPrice == null) {
      errors.push({ field: "rawPrice", error: "rawPrice required" });
    }
    if (typeof product.rawPrice !== "number") {
      errors.push({ field: "rawPrice", error: "rawPrice must be number" });
    }
    if (typeof product.price !== "number") {
      errors.push({ field: "price", error: "price must be number" });
    }
    if (product.price < product.rawPrice) {
      errors.push({
        field: "price",
        error: "price value  must greater than raw price",
      });
    }
    if (product.code === "" || product.code == null) {
      errors.push({ field: "code", error: "code required" });
    }
    if (typeof product.code !== "string") {
      errors.push({ field: "code", error: "code must be string" });
    }
    if (!userKeyRegExp.test(product.code)) {
      errors.push({
        field: "code",
        error: "code must format like this (ABC-abc-1234)",
      });
    }

    if (typeof product.color !== "undefined") {
      if (typeof product.color !== "string") {
        errors.push({ field: "color", error: "color must be string" });
      }
    }

    if (typeof product.description !== "undefined") {
      if (typeof product.description !== "string") {
        errors.push({
          field: "description",
          error: "description must be string",
        });
      }
    }

    if (typeof product.stockCount !== "undefined") {
      if (typeof product.stockCount !== "number") {
        errors.push({
          field: "stockCount",
          error: "stockCount must be string",
        });
      }
    }

    if (!categoriesService.doesCategoryIdExist(product.categoryId)) {
      errors.push({ field: "category", error: "categoryId must be exist" });
    }
    var re = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/;
    if (typeof product.expirationDate !== "undefined") {
      if (!product.expirationDate.match(re)) {
        errors.push({
          field: "expirationDate",
          error: "expirationDate must be format like 11/7/2020",
        });
      }
    }
    return {
      errors,
      isValid: !errors.length,
    };
  }

  doesProductIdExist(id) {
    return !!this.getByIdSync(id);
  }
}
const productsService = new products(__dirname + "/../data/products.json");

module.exports = productsService;
