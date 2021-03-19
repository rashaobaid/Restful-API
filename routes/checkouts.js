const checkoutsService = require("../Services/checkouts");
const checkoutRoutes = (app) => {
  // get all checkout
  app.get("/checkouts", (req, res) => {
    checkoutsService.getAll().then((data) => res.send(data));
  });

  app.post("/checkouts", (req, res) => {
    const validation = checkoutsService.validateCheckout(req.body);
    if (!validation.isValid) {
      checkoutsService.sendValidationErrorResp(res, validation);
    } else {
      const checkout = req.body;
      checkoutsService
        .creatcheckout(checkout)
        .then((data) => res.send({ message: "new checkout  added" }))
        .catch(res.status(404));
    }
  });
};
module.exports = checkoutRoutes;
