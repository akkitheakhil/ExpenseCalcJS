const express = require('express');
const app = express();
const path = require('path');


app.use("/static", express.static(path.resolve(__dirname, "src", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "src", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App servered at ${port}`));


