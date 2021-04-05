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
    this.readFile();
    let length_keys = Object.keys(this.data);
    let newCategoryId=0
    if( length_keys === undefined || length_keys.length ===0){
      newCategoryId = newCategoryId+1
    }
    else{
      length_keys = length_keys.map(id => parseInt(id))
      newCategoryId = length_keys[length_keys.length-1] + 1
    }
    let categoryDate =` ${new Date().toJSON().slice(0,10)} ${new Date().toJSON().slice(11,19)}` ;
    const newCategory = { Id: newCategoryId,date:categoryDate,...info  };
    const category = {...this.data,[newCategoryId]: newCategory };
    this.writeFile(category);
    this.readFile() //update this.data before return it back 
    return Promise.resolve(this.data);
  }

  // UPDATE category
  updateCategory(id, info) {
    this.readFile();
    if(this.doesCategoryIdExist(id)){
      const updatedCategory = {...this.data[id],name:info.name };
    this.data[id] = updatedCategory;
    console.log(this.datay) 
    this.writeFile(this.data);
    this.readFile() //update this.data before return it back 
    return Promise.resolve(this.data);
    }
    return Promise.reject({err:'category not found'});
  }

  // DELETE categ
  deleteCategory(id) {
    console.log(id)
    this.readFile();
    if(this.doesCategoryIdExist(id)){
    delete this.data[id];
    console.log(this.data)
    const keysa = Object.keys(this.data).length
    console.log("after delete",keysa)
    this.writeFile(this.data);
    this.readFile()
    return Promise.resolve(this.data);
    }
    return Promise.reject({err:'category not found'});
  }

  doesCategoryIdExist(id) {
    console.log(!!this.getByIdSync(id));
    return !!this.getByIdSync(id);
    
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
  
}
const categoriesService = new categories(
  __dirname + "/../data/categories.json"
);
module.exports = categoriesService;
