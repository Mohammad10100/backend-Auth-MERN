const User = require("../models/User")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.signup = async (req, res) => {
    try {
        //extract information from body
        const { username, email, password, role } = req.body

        // check if user already exists 
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json(
                {
                    success: false,
                    messege: "User Already exists"
                }
            );
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch (error) {
            return res.status(777).json(
                {
                    success: false,
                    data: "Error in hashing the password",
                    messege: error.messege
                }
            );
        }
        const response = await User.create({ username, email, password: hashedPassword, role })

        res.status(200).json(
            {
                success: true,
                messege: "entry successfull"
            }
        );

    } catch (error) {
        console.error(error.messege);
        res.status(500).json(
            {
                success: false,
                data: "Internal server error",
                messege: error.messege
            }
        );
    }
}


exports.login = async (req, res) => {
    try {
        //extract information from body
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json(
                {
                    success: false,
                    messege: "Please enter email and password"
                }
            )
        }
        // check if user already exists 
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    messege: "User does not exist"
                }
            );
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            )
            user = user.toObject()
            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            // testing the cookies 
            res.cookie("token", token, options).status(200).json(
                {
                    success: true,
                    token,
                    user,
                    messege: "Logged in successfully"
                }
            );
            // res.status(200).json(
            //     {
            //         success: true,
            //         token,
            //         user,
            //         messege: "Logged in successfully"
            //     }
            // );
        } else {
            return res.status(500).json(
                {
                    success: false,
                    data: "You entered wrong credentials",
                    messege: error.messege
                }
            );
        }

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                data: "Internal server error",
                messege: error.messege
            }
        );
    }
}

