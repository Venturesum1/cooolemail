const express = require("express");
const router = express.Router();
const Email = require("../models/Email");

// Get all emails (default route)
router.get("/", async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get emails by category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const emails = await Email.find({ category }).sort({ createdAt: -1 });

    if (emails.length === 0) {
      return res.status(404).json({ message: "No emails found in this category" });
    }

    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a specific email by ID
router.get("/:id", async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: "Email not found" });
    res.json(email);
  } catch (error) {
    console.error("Error fetching email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
