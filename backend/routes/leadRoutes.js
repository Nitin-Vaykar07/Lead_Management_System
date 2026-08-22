const express = require("express");

const {
    createLead,
    getLeads
} = require("../controllers/leadController");

const router = express.Router();

router.post("/lead", createLead);

router.get("/lead", getLeads);

module.exports = router;