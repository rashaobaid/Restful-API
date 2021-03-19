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
        .then((data) => res.status(200).send({ message: "new category added" }))
        .catch((err) => {
          res.status(404);
        });
    }
  });

  // UPDATE
  app.put("/category/:id", (req, res) => {
    const validation = categoriesService.validateCategorie(req.body);
    if (!validation.isValid) {
      categoriesService.sendValidationErrorResp(res, validation);
    } else {
      const categoryId = req.params["id"];
      const category = req.body;
      categoriesService
        .updateCategory(categoryId, category)
        .then((data) =>
          res.send({ message: `category id:${categoryId} update` })
        )
        .catch((err) => {
          res.status(404).send({ err: "category not found" });
        });
    }
  });

  // DELETE
  app.delete("/category/:id", (req, res) => {
    const categoryId = req.params["id"];
    categoriesService
      .deleteCategory(categoryId)
      .then((data) =>
        res.send({ message: `category id:${categoryId} removed` })
      )
      .catch((err) => {
        res.status(404).send({ err: "category not found" });
      });
  });
};

module.exports = categorieRoutes;
