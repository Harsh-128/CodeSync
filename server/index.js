const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send(`
        <h1>🚀 Welcome to CodeSync</h1>
        <p>My first Express Server is running successfully.</p>
    `);
});

app.get("/about", (req, res) => {
    res.send("<h1>About CodeSync</h1>");
});

app.get("/contact", (req, res) => {
    res.send("<h1>Contact Page</h1>");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});