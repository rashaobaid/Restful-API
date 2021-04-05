const loginRoutes = (app, fs) => {
  const dataPath = "./data/users.json";
  const readFile = () => JSON.parse(fs.readFileSync(dataPath));
  app.post("/login", (req, res) => {
    const data = readFile();
    const email = req.body.email;
    const password = req.body.password;
    var t = false;
    const user = Object.values(data).find(
      (user) => user.email === email && user.password === password
    ); // get all user

    if (!!user) {
      res.status(200).send({ message: "login Success",user });
    } else {
      res.status(401).send({errors: "login Failed" });
    }
  });
};
module.exports = loginRoutes;
