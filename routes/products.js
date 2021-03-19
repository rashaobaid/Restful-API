const productsService = require("../Services/products");
const productRoutes = (app) => {
  // get all product
  app.get("/products", (req, res) => {
    productsService.getAll().then((data) => res.send(data));
  });

  //get one product
  app.get("/product/:id", (req, res) => {
    const categorieId = req.params.id;
    return productsService
      .getById(categorieId)
      .then(data=>{
        res.status(200).send(data)
       })
       .catch(err=>{
         res.status(404).send({err:'product not found'})});
  });

  //   add new product
  app.post("/product", (req, res) => {
    const validation = productsService.validateProduct(req.body);
    if (!validation.isValid) {
      productsService.sendValidationErrorResp(res, validation);
    } else {
      const product = req.body;
      productsService
        .creatProduct(product)
        .then((data) => res.send({ message: "new product added" }))
        .catch(res.status(404));
    }
  });

  // UPDATE
  app.put("/product/:id", (req, res) => {
    const validation = productsService.validateProduct(req.body);
    if (!validation.isValid) {
      productsService.sendValidationErrorResp(res, validation);
    } else {
        const productId = req.params["id"];
        const product = req.body;
        productsService
          .updateProduct(productId , product)
          .then((data) => {
            res.status(200).send({ message: `product id:${productId} updated` });
          })
          .catch((err) => {
            res.status(404).send({ err: "product not found" });
          });
    }
  });

  // DELETE
  app.delete("/product/:id", (req, res) => {
    const productId = req.params["id"];
    productsService.deleteProduct(productId)
    .then((data) =>
        res.send({ message: `product id:${productId} removed` })
      )
      .catch((err) => {
        res.status(404).send({ err: "category not found" });
      });
  });
};

module.exports = productRoutes;
