
const fs = require("fs")
class users {
    data = [];
    filePath = ""
    constructor(filePath){ this.filePath = filePath;}  

    readFile = ()=>{
       this.data = JSON.parse( fs.readFileSync(this.filePath));
    } 

    writeFile = (fileData) => (fs.writeFileSync(this.filePath, JSON.stringify(fileData)));

    getAll(){
        this.readFile();
        return Promise.resolve(this.data);
    }

    getById(id){
        this.readFile();
        return Promise.resolve(this.data[id]);
    }
    //   add new categ
    creatUser(info){
        this.readFile();
        const newuserId = Object.keys(this.data).length + 1;
        const newUser =  {"Id":newuserId,...info}
        const Users = {[newuserId]: newUser ,...this.data};
       this.writeFile(Users);
       return Promise.resolve(this.data);
    }

    // UPDATE categ
    updateUser(id,info){
        this.readFile();
        this.data[id] = info;
       this.writeFile(this.data);
       return Promise.resolve(this.data);
    }

   // DELETE categ
   deleteUser(id){
        this.readFile();
        delete this.data[id]; 
        this.writeFile(this.data);
       return Promise.resolve(this.data);
    }

   
   
}
const usersService = new users(__dirname+'/../data/users.json');

module.exports = usersService