import express from "express";
import { Book } from "../models/bookModel.js";

const router = express.Router();

//Route to POST (SAVE) a NEW book
router.post("/", async (request, response) => {
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
router.get("/", async (request, response) => {
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
router.get("/:id", async (request, response) => {
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
router.put("/:id", async (request, response) => {
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
router.delete("/:id", async (request, response) => {
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

export default router;
