import express  from "express";
import path from "path"
import { fileURLToPath } from 'url';
import methodOverride from "method-override"
import mongoose from "mongoose";
import { Campground } from "./models/campground.js";

const port = 3000
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

main().catch(err => console.log(err));
main().then(() => {
    console.log("mongo connection established");
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
}

app.use(methodOverride('_method'))
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));

app.get("/",(req,res) => {
    console.log('got request on / GET')
    res.render('home')
})

app.post("/campground",async(req,res) => {
    console.log("got request on /campground POST")
    console.log(req.body)
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(302,`/campground/${newCamp._id}`)
})

app.get("/campground",async(req,res) => {
    const campground = await Campground.find({})
    console.log('got request on /campground GET');
    res.render('campgrounds/index' , { campground })
});

app.get('/campground/:id/edit',async(req,res) => {
    const {id} =req.params
    const campground = await Campground.findById(id) 
    console.log("got request on /campground/:id/edit GET")
    res.render('campgrounds/edit', {campground})
})

app.get('/campground/new',(req,res) => {
    console.log("got request on /campground/new GET")
    res.render('campgrounds/new')
})

app.get("/campground/:id",async(req,res) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id) 
    res.render('campgrounds/show', { campground })
})

app.put("/campground/:id",async(req,res) => {
    console.log("got request on /campground/:id PUT")
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.redirect(302, `/campground/${campground._id}`);
})

app.delete("/campground/:id", async (req, res) => {
    console.log("got request on /campground/:id DELETE");
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    console.log(`deleted ${JSON.stringify(deletedCamp)}`)
    res.redirect(302, "/campground")
})

app.listen(port,() => {
    console.log(`server running on port ${port}`);
});