const express = require("express");
const mysql = require("mysql");

const app = express();

const config = {
    host: "db",
    user: "root",
    password: "root",
    database: "nodedb"
}

const connection = mysql.createConnection(config);

const selectAllPeopleCommand = `SELECT * FROM People;`
const insertPeopleCommand = `INSERT INTO People(name) VALUES ("?")`;

app.get("/", (req, res) => {
    connection.query(selectAllPeopleCommand, (error, results, fields) => {
        if (error) return res.send(error.message);

        const peopleList = results.map(result => {
            return result.name;
        });

        return res.send("<h1>FullCycle Rocks!</h1> <br/> People: " + peopleList.join(", "));
    });
});

app.get("/:name", (req, res) => {
    const name = req.params.name;

    connection.query(insertPeopleCommand, name, (error, results, fields) => {
        if (error) return res.send(error.message);

        return res.send(`<h1>New database record "${name}" added successfully!</h1>`);
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});