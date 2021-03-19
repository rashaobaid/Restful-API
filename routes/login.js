const loginRoutes = (app, fs) => {
  const dataPath = "./data/users.json";
  const readFile = () => JSON.parse(fs.readFileSync(dataPath));
  app.post("/login", (req, res) => {
    const data = readFile();
    const name = req.body.name;
    const pw = req.body.pw;
    var t = false;
    const user = Object.values(data).find(
      (v) => v.name === name && v.pw === pw
    ); // get all name

    if (!!user) {
      res.status(200).send({ message: "login Success" });
    } else {
      res.status(401).send({ message: "login Failed" });
    }
  });
};
module.exports = loginRoutes;
