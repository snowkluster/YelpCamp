import mongoose from "mongoose";
import { Campground } from "../models/campground.js";
import { cities } from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";
import axios from "axios";
import 'dotenv/config'

mongoose.set('strictQuery', true);
const apikey=process.env.API_KEY;

main().catch(err => console.log(err));
main().then(() => {
    console.log("mongo connection established");
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
}

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: apikey,
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const prices = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImg(),
            price: prices,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non massa quis leo sollicitudin lobortis. Donec vitae euismod augue. Ut in metus ut justo consequat fermentum in non felis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})