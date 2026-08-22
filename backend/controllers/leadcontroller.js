const db = require("../config/db");

// CREATE LEAD
const createLead = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Check duplicate email
        const [existingLead] = await db.execute(
            "SELECT id FROM leads WHERE email = ?",
            [email]
        );

        if (existingLead.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Insert lead
        await db.execute(
            "INSERT INTO leads (name, email) VALUES (?, ?)",
            [name, email]
        );

        return res.status(201).json({
            success: true,
            message: "Lead created successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// GET ALL LEADS
const getLeads = async (req, res) => {
    try {
        const [leads] = await db.execute(
            "SELECT id, name, email, created_at FROM leads ORDER BY id DESC"
        );

        return res.status(200).json(leads);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch leads"
        });
    }
};


module.exports = {
    createLead,
    getLeads
};