import express from 'express';
import { randomUUID } from 'crypto';
import { error } from 'console';

const app = express();

const HASH_MAP = {};
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/users/create",(req, res)=>{

    const { username, email, age } = req.body;

    // Basic validation
    if (!username ) {
        return res.status(400).json({ error: 'username and email are required' });
    }
    if(!email){
        return res.status(400).json({ error: 'email is required' });
    }
    if (typeof age !== 'number' || age <= 0) {
        return res.status(400).json({ error: 'age must be a positive number' });
    }

  
    if(email){
        const emailExists = Object.values(HASH_MAP).some(user => user.email === email);
        if(emailExists){
            return res.status(400).json({ error: 'email must be unique' });
        }
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!pattern.test(email)){
            return res.status(400).json({ error: 'email format is invalid' });
        }
    }

    const id = randomUUID();

    const user = { id, username, email, age };

    HASH_MAP[id] = user;

    return res.status(201).json({message: "User created successfully", id, user });
})

app.get("/users/:id", (req , res)=>{
    const {id } = req.params;
    const user = HASH_MAP[id];

    if(!user){
        return res.status(404).json({error: "user not found"});
    }
    return res.status(200).json({user});
})

app.delete("/users/:id", (req,res)=>{
    const {id} = req.params;

    const user = HASH_MAP[id];
    if(!user){
        return res.status(404).json({error: "user not found"});
    }
    delete HASH_MAP[id];
    return res.status(200).json({message: "user deleted successfully"});
})
 
app.put("/users/:id", (req,res)=>{
    const {id} = req.params;
    const { username, email, age } = req.body;

    const user = HASH_MAP[id];
    if(!user){
        return res.status(404).json({error: "user not found"});
    }

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;
    user.age = age || user.age;

    return res.status(200).json({message: "user updated successfully", user });
})




app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})