const express = require("express");
const router = express.Router();
const axios = require("axios");
const Email = require("../models/Email");

router.post("/trigger", async (req, res) => {
    const email = await Email.findById(req.body.emailId);

    if (!email) return res.status(404).json({ message: "Email not found" });

    await axios.post("https://webhook.site/example", { email });

    res.json({ message: "Webhook triggered" });
});

module.exports = router;
