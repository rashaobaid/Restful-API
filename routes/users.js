const usersService = require("../Services/users")
const userRoutes = (app) => {
   
  // get all user
   app.get('/users', (req, res) => {
    usersService.getAll().then(data=>res.send(data))
  });

  //get one user
  app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    return usersService
    .getById(userId)
    .then(data=>res.send(data))
    .catch(res.status(404));
  });
  
  

//   add new user
app.post('/users',(req, res) => {
    const user = req.body;
    usersService.creatUser(user)
    .then(data=>res.send({message:'new user added'}))
    .catch(res.status(404));
       
});
  
// UPDATE
app.put('/users/:id', (req, res) => {
    const userId = req.params["id"];
    const user =req.body;
    usersService.updateUser(userId,user)
    .then(data=>res.send({message:`user id:${userId} update`}))
    .catch(res.status(404));
     
});

// DELETE
app.delete('/users/:id', (req, res) => {
    const userId = req.params["id"];
    usersService.deleteUser(userId)
    .then(data=>res.send({message:`user id:${userId} removed`}))
    .catch(res.status(404));
  });
  
};
  
module.exports = userRoutes;