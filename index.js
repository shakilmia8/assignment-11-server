const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 9000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rt3ae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("TravelTrip");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection('orders');

        // get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // get single API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // post api
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const service = await servicesCollection.insertOne(newService);
            res.json(service);
        });

        // Add Orders Api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        // Update Api
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    country: updatedService.country,
                    img: updatedService.img,
                    describe: updatedService.describe
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // Delete API
        app.delete('/services:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Yes!!! server is ready')
})

app.listen(port, () => {
    console.log(`Server Live link is https://localhost/${port}`);
})