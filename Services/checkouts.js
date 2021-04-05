const fs = require("fs");
const productsService = require("./products");

class checkouts {
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

  //   add new user
  creatcheckout(info) {
    this.readFile();
    const newcheckouttId = Object.keys(this.data).length + 1;
    const newcheckout = { Id: newcheckouttId, ...info };
    const Checkouts = { [newcheckouttId]: newcheckout, ...this.data };
    this.writeFile(Checkouts);
    return Promise.resolve(this.data);
  }

  sendValidationErrorResp = (res, validation) => {
    res.status(422).send({
      message: "Validation Error",
      errors: validation.errors,
      data: null,
    });
  };

  validateCheckout (Checkout)  {
    this.readFile();
    const errors = [];
    var re = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/;
    if (typeof  Checkout.date !== "undefined") {
      if (! Checkout.date.match(re)) {
        errors.push({
          field: "Date",
          error: "Date must be date",
        });
      }
    }
    if (!productsService.doesProductIdExist(Checkout.products[0].productId)) {
      errors.push({ field: "product", error: "productId must be exist" });
    }
    if (typeof Checkout.products[0].unitPrice !== "number") {
      errors.push({ field: "unitPrice", error: "unitPrice must be number" });
    }
    if (typeof Checkout.products[0].Quantity !== "number") {
      errors.push({ field: "Quantity", error: "Quantity must be number" });
    }
    if (
      Checkout.products[0].subtotal !==
      Checkout.products[0].Quantity * Checkout.products[0].unitPrice
    ) {
      errors.push({
        field: "subtotal",
        error: "Quantity must be  unitPrice*Quantity",
      });
    }
    if (typeof Checkout.total !== "number") {
      errors.push({ field: "total", error: "total must be number" });
    }
    if (typeof Checkout.discount !== "number") {
      errors.push({ field: "discount", error: "discount must be number" });
    }
    if (typeof Checkout.paymentamount !== "number") {
      errors.push({
        field: "paymentamount",
        error: "paymentamount must be number",
      });
    }
    if (typeof Checkout.paymentmethod !== "string") {
      errors.push({
        field: "paymentmethod",
        error: "paymentmethod must be string",
      });
    }
    
    return {
      errors,
      isValid: !errors.length,
    };
  };
  
}
const checkoutsService = new checkouts(__dirname + "/../data/checkouts.json");

module.exports = checkoutsService;
