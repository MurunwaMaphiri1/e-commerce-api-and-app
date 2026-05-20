import type { Request, Response } from "express";
import Users from "../models/user.model.js";
import bcrypt from "bcrypt";
import  Jwt  from "jsonwebtoken";
import mongoose from "mongoose";

// Get all Users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const user = await Users.find();
        res.status(200).send(user)
    } catch(error) {
        res.status(500).send({ message: "Error fetching users" });
    }
};

// SignUp
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Fields cannot be empty" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            name, 
            email,
            password: hashedPassword,
            role,
        });

        res.send({
            message: "Sign up successful",
            user,
        });

    } catch(error) {
        res.status(500).send({ message: "Signup failed" })
    }
};

// Login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) return res.status(400).send({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        const token = Jwt.sign(
            { 
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET as string
        );

        res.send({ token });
    } catch(error) {
        res.status(500).send({ message: "Login Failed" })
    }
};

// Get User by ID
export const getUserById = async (req: Request, res: Response) => {
    try {

        if (!req.query.id || typeof req.query.id !== "string") {
            return res.status(400).send({ message: "Invalid ID" });
        }

        const id = req.query.id;
        const userID = await Users.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: true, 
                          name: true,
                          role: true,
                          email: true,
                          createdAt: true 
                        } }
        ])
        res.status(200).send(userID);
    } catch(error) {
        res.status(500).send({ message: "Server error" })
    }
};

// Delete user by ID
export const deleteUserById = async (req: Request, res: Response) => {
    try {

         if (!req.query.id || typeof req.query.id !== "string") {
            return res.status(400).send({ message: "Invalid ID" });
        }

        const id = req.query.id;
        if (!id) {
            res.status(400).send({
                message: "id parameter cannot be empty"
            })
        }
        const userID = Users.deleteOne(
            { _id: new mongoose.Types.ObjectId(id) }
        )
        res.status(200).send(userID);
    } catch(error) {
        console.error({
            message: "Error occured while fetching user", error
        })
    }
};