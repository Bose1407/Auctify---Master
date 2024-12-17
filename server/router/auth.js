const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");
require('../db/conn');
const User = require("../model/userSchema");

// Basic Route
router.get('/', (req, res) => {
    res.send(`Router js is called`);
});

// Registration Route
router.post('/register', async (req, res) => {
    const { name, email, phone, password, cpassword } = req.body;
    
    
    

    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(400).json({ error: "Please fill all required fields" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password should be at least 8 characters" });
    }

    try {
        const userExist = await User.findOne({ email });
        
        if (userExist) {
            return res.status(400).json({ error: "Email already exists" });
        } else if (password !== cpassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        } else {
            const user = await User.create({ name, email, phone, password,cpassword });
            res.status(201).json({ message: "User registered successfully", user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Sign In Route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const userLogin = await User.findOne({ email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            } else {
                const token = await userLogin.generateAuthToken();
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                res.json({ message: "User signed in successfully" });
            }
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// About Us Route
router.get('/about', authenticate, (req, res) => {
    res.send(req.rootUser);
});

// Get User Data Route
router.get('/getdata', authenticate, (req, res) => {
    res.send(req.rootUser);
});

// Change Password Route
router.put('/password/update', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userID).select("+password");

        const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        user.password = req.body.newPassword;
        await user.save();
        res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        console.error(`Password reset error: ${error}`);
        res.status(500).json({ error: "Server error" });
    }
});

// Update User Profile Route
router.put('/me/update', authenticate, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const newUserData = { name, email, phone };

        const user = await User.findByIdAndUpdate(req.userID, newUserData, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(`Profile update error: ${error}`);
        res.status(400).json({ error: "Profile update error" });
    }
});

// Contact Us Route
router.post('/contact', authenticate, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields must be filled" });
        }

        const userContact = await User.findById(req.userID);

        if (userContact) {
            await userContact.addMessage(name, email, subject, message);
            res.status(201).json({ message: "Contact form submitted successfully" });
        }
    } catch (error) {
        console.error(`Contact form error: ${error}`);
        res.status(500).json({ error: "Server error" });
    }
});

// Feedback Route
router.post('/feedback', authenticate, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields must be filled" });
        }

        const userContact = await User.findById(req.userID);

        if (userContact) {
            await userContact.addFeedback(name, email, subject, message);
            res.status(201).json({ message: "Feedback submitted successfully" });
        }
    } catch (error) {
        console.error(`Feedback error: ${error}`);
        res.status(500).json({ error: "Server error" });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send("User logged out successfully");
});

module.exports = router;
