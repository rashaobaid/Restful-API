const fs = require("fs");
class categories {
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
    if(this.doesCategoryIdExist(id)){
      return Promise.resolve(this.data[id]);
    }
    return Promise.reject({err:'category not found'});
  }

  getByIdSync(id) {
    this.readFile();
    return this.data[id];
  }

  //   add new category
  creatCategory(info) {
    console.log(info);
    this.readFile();
    const newCategoryId = Object.keys(this.data).length + 1;
    const newCategory = { Id: newCategoryId, ...info };
    const category = { [newCategoryId]: newCategory, ...this.data };
    this.writeFile(category);
    return Promise.resolve(this.data);
  
  }

  // UPDATE categ
  updateCategory(id, info) {
    this.readFile();
    if(this.doesCategoryIdExist(id)){
    this.data[id] = info;
    this.writeFile(this.data);
    return Promise.resolve(this.data);
    }
    return Promise.reject({err:'category not found'});
  }

  // DELETE categ
  deleteCategory(id) {
    this.readFile();
    if(this.doesCategoryIdExist(id)){
    delete this.data[id];
    this.writeFile(this.data);
    return Promise.resolve(this.data);
    }
    return Promise.reject({err:'category not found'});
  }

  // validateCategoryForAddition(catObjet)
  sendValidationErrorResp = (res, validation) => {
    res.status(422).send({
      message: "Validation Error",
      errors: validation.errors,
      data: null,
    });
  };
  validateCategorie(categorie) {
    this.readFile();
    const allCategorieNames = Object.values(this.data).map((v) => v.name); // get all USer names
    const errors = [];
    if (allCategorieNames.includes(categorie.name)) {
      errors.push({ field: "name", error: "Name category must be unique" });
    }
    if ( typeof categorie.name=='undefined'||categorie.name=="" ||categorie.name==null) {
      errors.push({ field: "name", error: "Name category required" });
    }
    return {
      errors,
      isValid: !errors.length,
    };
  }
  doesCategoryIdExist(id) {
    return !!this.getByIdSync(id);
  }
}
const categoriesService = new categories(
  __dirname + "/../data/categories.json"
);
module.exports = categoriesService;
