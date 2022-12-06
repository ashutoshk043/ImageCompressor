const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const bodyParser = require('body-parser')

const storage = multer.memoryStorage();
const upload = multer({ storage });

const port = 3000
const app = express()
app.use(multer().any())
app.use(bodyParser.json());
app.use(express.static("./uploads"));


app.post("/compressImage", async (req, res) => {
    // The logic goes here.

    try {
        fs.access("./uploads", (error) => {
            if (error) {
                fs.mkdirSync("./uploads");
            }
        });
        const { buffer, originalname } = req.files[0];
        const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9 ]/g, '');
        const ref = `${timestamp}-${originalname.split(' ').join('')}`;

        await sharp(buffer)
            .png({ quality: 20 })
            .toFile("./uploads/" + ref);

        const link = `http://localhost:3000/${ref}`;
        return res.json({ link });
    } catch (error) {
        res.status(500).send({status:false, message: error.message})
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})