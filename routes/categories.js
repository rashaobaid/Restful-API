const categoriesService = require("../Services/categories");
const categorieRoutes = (app) => {
  // get all categorie
  app.get("/categories", (req, res) => {
    categoriesService.getAll().then((data) => res.send(data));
  });

  //get one category
  app.get("/category/:id", (req, res) => {
    const categoryId = req.params.id;
    return categoriesService
      .getById(categoryId)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(404).send({ err: "category not found" });
      });
  });

  //   add new category
  app.post("/category", (req, res) => {
    const validation = categoriesService.validateCategorie(req.body);
    if (!validation.isValid) {
      categoriesService.sendValidationErrorResp(res, validation);
    } else {
      const category = req.body;
      categoriesService
        .creatCategory(category)
        .then((data) => {
          const category_keys = Object.keys(data)
          const last_key = category_keys[category_keys.length-1]
          res.status(200).send({ message: "new category added", category: data[last_key]})
        })
        .catch((errors) => {
          res.status(404).send({ errors: errors});
        });
    }
  });

  // UPDATE
  app.put("/category/:id", (req, res) => {
    const validation = categoriesService.validateCategorie(req.body);
    console.log("params", req.params)
    console.log("body", req.body)
    console.log("is update valud ? ", validation)
    if (!validation.isValid) {
      categoriesService.sendValidationErrorResp(res, validation);
    } else {
      const categoryId = req.params["id"];
      const category = req.body;
      categoriesService
        .updateCategory(categoryId, category) 
        .then((data) =>
          res.send({ message: `category id:${categoryId} update`, category: data[categoryId] })
        )
        .catch((errors) => {
          res.status(404).send({errors: errors });
        });
    }
  });

  // DELETE
  app.delete("/category/:id", (req, res) => {
    const categoryId = req.params["id"];
    categoriesService
      .deleteCategory(categoryId)
      .then((data) =>{
       console.log( "from reouter",data) 
        res.send({ message: `category id:${categoryId} removed` })
     } )
      .catch((errors) => {
        res.status(404).send({errors: "category not found" });
      });
  });
};

module.exports = categorieRoutes;
