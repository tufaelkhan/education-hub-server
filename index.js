const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgmlfql.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const admissionCollection = client.db('admissionCollege').collection('colleges')

    const studentCollection = client.db('admissionCollege').collection('students')

    //all college route
    app.get('/colleges', async(req, res)=>{
        const cursor = admissionCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/colleges/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await admissionCollection.findOne(query)
      res.send(result)
    })

    //profile
    app.get('/profile', async(req, res)=>{
      const cursor = studentCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/profile/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await studentCollection.findOne(query);
      res.send(result)
    })

    app.put('/profile/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateProfile = req.body;
      const updateStudent = {
        $set: {
          name: updateProfile.name,
           address: updateProfile.address,
            photo: updateProfile.photo, 
            college: updateProfile.college,
             subject: updateProfile.subject,
              phone: updateProfile.phone,
        }
      }
      const result = await studentCollection.updateOne(filter, updateStudent, options)
      res.send(result)
    })

    //specific user route
    app.get('/student', async(req, res)=>{
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await studentCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/student', async(req, res)=>{
      const newStudent = req.body;
      console.log(newStudent);
      const result = await studentCollection.insertOne(newStudent)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('admission going on')
})

app.listen(port, ()=>{
    console.log(`admission is running on port: ${port}`);
})