const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const fs = require("fs");

let orders = [];

express()
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(express.static("public"))
    .get("/", (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    })
    .get("/api/allergens", (req, res) => {
        const allergens = JSON.parse(
            fs.readFileSync(__dirname + "/data/allergens.json")
        );
        res.json(allergens);
    })
    .get("/api/pizza", (req, res) => {
        const pizzas = JSON.parse(
            fs.readFileSync(__dirname + "/data/pizza.json")
        );
        res.json(pizzas);
    })
    .get("/cart", (req, res) => {
        console.log(orders);
        res.sendFile(__dirname + "/public/form.html");
    })
    .get("/api/order", (req, res) => {
        res.json(orders);
    })
    .post("/api/order", (req, res) => {
        const d = new Date();
        orders.push({
            id: orders.length + 1,
            pizzas: req.body.order,
            date: {
                year: d.getFullYear(),
                month: d.getMonth(),
                day: d.getDay(),
                hour: d.getHours(),
                minute: d.getMinutes(),
            },
            customer: {
                name: "John Doe",
                email: "jd@example.com",
                address: {
                    city: "Palermo",
                    street: "Via Appia 6",
                },
            },
        });
        res.json(orders);
    })
    .listen(9001, () =>
        console.log(`server listening on http://localhost:9001/`)
    );
