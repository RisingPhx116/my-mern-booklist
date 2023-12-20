import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors";


const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleeware for handling CORS Policy
//Option 1: Allows ALL Origins w Default of cors(*)
app.use(cors());
//Option 2: Allow Custom Origins
// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         methods: ["GET","POST", "PUT","DELETE"],
//         allowedHeaders: ["Content-Type"]
//     })
// )


app.get("/", (request, response) => {
    console.log(request)
    return response.status(234).send("My MERN Bookstore Tutorial")
});

app.use("/books", booksRoute);

//Route to POST (SAVE) a NEW book
app.post("/books", async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: "Send all require fields: title, auther, publishYear",
            });
        }

        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear
        };

        const book = await Book.create(newBook)
        return response.status(201).send(book);
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route to get ALL Books from DB
app.get("/books", async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    }catch(error) {
        console.log(error.message);
        response.status(500).send({error: error.message});
    }
});

//Route to get ONE Book from DB by id
app.get("/books/:id", async (request, response) => {
    try {
        const {id} = request.params;
        const book = await Book.findById(id);
        return response.status(200).json(book);
    }catch(error) {
        console.log(error.message);
        response.status(500).send({error: error.message});
    }
});

//Route to UPDATE a book
app.put("/books/:id", async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: "Send all require fields: title, auther, publishYear",
            });
        }

        const {id} = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body);

        if(!result){
            return response.status(404).json({message: "Book Not Found"});
        }

        return response.status(200).send({message: "Book Upated Successfully"})

    }catch(error) {
        console.log(error.message);
        response.status(500).send({error: error.message});
    }
});

//Route to DELETE a book
app.delete("/books/:id", async (request, response) => {
    try {
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result){
            return response.status(404).json({message: "Book Not Found"});
        }
        return response.status(200).send({message: "Book Deleted Successfully"});
    }catch(error) {
        console.log(error.message);
        response.status(500).send({error: error.message});
    }
});


mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to DB");
        app.listen(PORT, () => {
            console.log(`app is listening to PORT ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

