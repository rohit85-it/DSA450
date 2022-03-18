
import cors from "cors"
import mongoose from "mongoose"
import express from "express"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'DSADb',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) : 
    console.log('Connected to yourDB-name database'));

// Schema for users of app
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose.model('users', UserSchema);
User.createIndexes();

console.log("App listen at port 5000");

app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by 
    // entering http://loacalhost:5000
    
    // If you see App is working means
    // backend working properly
});
app.post("/login", (req, res) => {
    // res.send("My API login")
    const { email, password } = req.body
    User.findOne({email: email},(err,user)=>{
        if(user){
            // res.send({message:"User already registered"})
            if(password===user.password){
                res.send({message:"Login successful",user:user})
            }
            else{
                res.send({message:"Password didn't match"})
            }
        }else{
            res.send({message:"User not registered"})
        }
    })
})

app.post("/register", async (req, resp) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            resp.send(req.body);
            console.log(result);
        } else {
            console.log("User already register");
        }

    } catch (e) {
        resp.send("Something Went Wrong");
    }
});
app.listen(5000);

