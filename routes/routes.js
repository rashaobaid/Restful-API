const userRoutes = require("./users");
const categorieRoutes = require("./categories");
const checkoutRoutes = require("./checkouts");
const productRoutes = require("./products");
const loginRoutes = require("./login");

const appRouter = (app, fs) => {
  

  userRoutes(app, fs);
  categorieRoutes(app);
  checkoutRoutes(app, fs);
  productRoutes(app, fs);
  loginRoutes(app, fs);
};

module.exports = appRouter;
