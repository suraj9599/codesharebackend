const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

//Intialize the app
const app = express();
app.use(express.json());
app.use(cors());

//connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then((res)=>{
    console.log("Database Connected");
})
.catch((error)=> {
    console.log(error);
})

//create a schema for storing the code
const codeSchema = new mongoose.Schema({
    code: String,
})
const Code = mongoose.model('Code', codeSchema);


//Endpoint to save the code
app.post("/api/save", async (req,res)=> {
    const {code} = req.body;
    const newCode = new Code({code});
    await newCode.save();
    res.json({codeId: newCode._id})
})

//Endpoint to retrieve code by id
app.get("/api/code/:id", async (req,res)=> {
    const {id} = req.params;
    const code = await Code.findById(id);
    if(code){
        res.json({code: code.code});
    }else{
        res.status(404).json({error: 'Could not found'});
    }
});

// Endpoint to update the code
app.put('/api/code/:id', async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;
    
    try {
      const updatedCode = await Code.findByIdAndUpdate(id, { code }, { new: true });
      if (updatedCode) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Code not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating code' });
    }
  });
  

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});