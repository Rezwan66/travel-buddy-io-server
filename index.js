const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MONGO DB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjzxbzp.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const serviceCollection = client.db('travelBuddyDB').collection('services');
        const bookingCollection = client.db('travelBuddyDB').collection('bookings');

        // SERVICES related API
        // GET all services
        app.get('/services', async (req, res) => {
            try {
                let queryObj = {};

                const serviceName = req.query.serviceName;
                const limit = parseInt(req.query.showLimit);
                console.log(serviceName, limit);

                if (serviceName) {
                    // set a searchPattern with $regex to find case-insensitive service name.
                    const searchPattern = new RegExp(serviceName, 'i');
                    queryObj.service_name = { $regex: searchPattern }
                }
                // db.InspirationalWomen.find({ first_name: { $regex: /serviceName/i } })

                const cursor = serviceCollection.find(queryObj).limit(limit);
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        });
        // GET service by id
        app.get('/services/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }

                const result = await serviceCollection.findOne(query);
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        });

        // BOOKINGS related API
        app.post('/bookings', async (req, res) => {
            try {
                const booking = req.body;
                console.log(booking);
                const result = await bookingCollection.insertOne(booking);
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// local apis
app.get('/', (req, res) => {
    res.send('Lets travel, buddy! 🚗');
})


app.listen(port, () => {
    console.log(`Travel Buddy server is running on port ${port}`)
})