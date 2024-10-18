const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const { MongoClient, ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db'); 

const app = express();
app.use(express.static('/home/sudharsan/projects/Ken_kart/backend/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const { createVectorDB,  getResponse,getinfo } = require('./llm_check.js');

app.use(cors({
  origin: 'http://localhost:3000', // Or your frontend URL
  credentials: true // Allow credentials (cookies)
}));

// Redis session setup
const redisClient = redis.createClient({ host: '127.0.0.1', port: 6379 });
redisClient.connect().catch(console.error);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'eren139',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// MongoDB connection setup
let db;
connectToDatabase().then(database => {
  db = database;
}).catch(error => {
  console.error('Failed to connect to MongoDB', error);
  process.exit(1);
});

let vdb;
async function main() {
  try {
    const filename = 'movies_dataset.txt';
     vdb = await createVectorDB(filename);
  }catch (error) {
    console.error(error.message);
  }
}

main();

// Routes come after session middleware
app.post('/login', async (req, res) => {
  const data = req.body;

  console.log(data);
  try {
    const collection = db.collection('login');
    const document = await collection.findOne({ email: data.email, pass_code: data.pass_code });

    if (document) {
      req.session.data = data.email;  // Store email in session

      console.log("session data");
      console.log(req.session.data);

      res.json({ message: true });
    } else {
      console.log('No document found with those credentials');
      res.json({ message: false });
    }
  } catch (err) {
    console.error('Error connecting to MongoDB or finding document:', err);
  }
});



app.post('/signup', async(req, res) => {
  const data = req.body;
  console.log(data);
  

  try {
    const collection = db.collection('login'); // Replace with your collection name
    const collection1 = db.collection('users');

    const document = await collection.findOne({email:data.email});

    if (document) {
      res.json({ message:true});
      
    } else {
          await collection.insertOne(data);
          await collection1.insertOne({'email':data.email,'watch_list':[]});
      console.log('No document found with that id');
      res.json({ message: false});
    }
  }
   catch (err) {
    console.error('Error connecting to MongoDB or finding document:', err);
  }

});

app.get('/watch_later', async(req, res) => {

  var email=req.session.data;
  if(email)
  {
        try {
              const collection = db.collection('users');
              
              const result=await collection.findOne({'email':email});

              const idsArray=result.watch_list;
                console.log(idsArray  );
                const collection1 = db.collection('movies'); // Replace with your collection name
            
                // Convert strings to ObjectId instances if necessary
                const objectIds = idsArray.map(id => new ObjectId(id));
            
                // Find all documents where _id is in the array of ObjectIds
                const documents = await collection1.find({
                                                        _id: { $in: objectIds }
                                                      }).toArray();
            
                console.log('Documents:', documents);
                res.json({ message: true ,documents:documents});
        } catch (err) {
                console.error('Error fetching documents:', err);
        }

  }
  else{
    res.json({ message: false });
  }
});



app.post('/watch_later', async(req, res) => {
  // Ensure session is properly set

  var email=req.session.data;
  var movie=req.body.id;

  if (req.session.data) {
    const collection = db.collection('users');
    const result = await collection.updateOne(
      { email: email}, 
      { $push: { watch_list: movie } } );

      if(result)
      {
        res.json({ message: true });
      }  
  } 
  
  else {
    console.log('No session found');
    res.json({ message: false });
  }
});

app.post('/main_data', async (req, res) => {
  try {
    console.log("mainPage Requested");
    // Use the `db` variable to interact with the database
    const collection = db.collection('movies');
    
    const findResult = await collection.aggregate([
      {
        $group: {
          _id: "$Genere", // Group by the Genere field
          movies: {
            $push: {
              _id: "$_id",          // Include the _id
              name: "$name",        // Include the name
              img: "$img",          // Include the img
              ratings: "$ratings",   // Include the ratings
              price: "$price",       // Include the price
              main_cat: "$main_cat"  // Include the main_cat
            }
          }
        }
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field from the result
          genre: "$_id", // Rename _id to genre
          movies: 1 // Include the movies array
        }
      }
    ]).toArray();
    
    // Log the formatted result
    console.log(findResult);
    
    //console.log(findResult);
    res.json(findResult);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'An error occurred while fetching data' });
  }
});


app.post('/sub_main',async(req,res)=>{

  var id=req.body.id;
  console.log(id);
 
  // const collection = db.collection('movies');
    
  //   const findResult = await collection.findOne({});
  try {
    const collection = db.collection('movies'); // Replace with your collection name

    const document = await collection.findOne({  _id: new ObjectId(id) });

    if (document) {
      console.log('Found document:', document);
      
    } else {
      console.log('No document found with that id');
    }

    res.json(document);
  } catch (err) {
    console.error('Error connecting to MongoDB or finding document:', err);
  }

  

});


const getBotResponse = async(message) => {
  // Here you can add your logic for processing user messages
  var {path,movie} = await getResponse(vdb, message);
  const dec= await getinfo(vdb, movie);
  
  path=(path!=undefined)?path:"Action/1.jpg";
  return {path,dec};
};

// Chat endpoint
app.post('/chat', async(req, res) => {
  const { message } = req.body; // Get the user message from the request
  const {path,dec} = await getBotResponse(message); // Generate a bot response
  console.log("Desciption:");
  console.log(dec);
  res.json({ response: path,description:dec }); // Send the response back to the client
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

