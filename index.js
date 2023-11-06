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
                const provider_email = req.query.email;
                // console.log(serviceName, limit, provider_email);

                if (serviceName) {
                    // set a searchPattern with $regex to find case-insensitive service name.
                    const searchPattern = new RegExp(serviceName, 'i');
                    queryObj.service_name = { $regex: searchPattern }
                }
                // db.InspirationalWomen.find({ first_name: { $regex: /serviceName/i } })

                if (provider_email) {
                    queryObj.provider_email = provider_email;
                }

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
        // POST a new service
        app.post('/services', async (req, res) => {
            try {
                const service = req.body;
                console.log(service);
                const result = await serviceCollection.insertOne(service);
                res.send(result);

            } catch (error) {
                console.log(error);
            }
        })
        // DELETE a service
        app.delete("/services/:id", async (req, res) => {
            try {
                const id = req.params.id;
                // console.log(id);
                const query = { _id: new ObjectId(id) };
                // console.log(query);
                const result = await serviceCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        });
        // EDIT a service
        app.put('/services/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const service = req.body;
                const updateDoc = {
                    $set: {
                        ...service,
                    },
                };
                console.log(filter, service, updateDoc);
                const result = await serviceCollection.updateOne(filter, updateDoc);
                res.send(result);

            } catch (error) {
                console.log(error);
            }
        })

        // BOOKINGS related API
        // GET all bookings
        app.get('/bookings', async (req, res) => {
            try {
                let queryObj = {};
                const userEmail = req.query?.userEmail;
                const providerEmail = req.query?.providerEmail;

                if (userEmail) {
                    queryObj.user_email = userEmail;
                }
                if (providerEmail) {
                    queryObj.provider_email = providerEmail;
                }
                console.log(userEmail, queryObj, providerEmail);

                const cursor = bookingCollection.find(queryObj);
                const result = await cursor.toArray();
                res.send(result);

            } catch (error) {
                console.log(error);
            }
        })
        // CREATE bookings
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
        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const bookingStatus = req.body;
            console.log(id, bookingStatus);

            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: bookingStatus.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updatedDoc);
            res.send(result);
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