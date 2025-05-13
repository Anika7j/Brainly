import express from "express";
import User from "./userSchema";
import bcrypt from "bcryptjs"
import jwt, { sign } from "jsonwebtoken";
import { Request, Response } from "express";
import {JWT_SECRET_KEY} from "./config"
import { userAuthorization } from "./middleware";
import Content from "./contentSchema";
import Link from "./linkSchema";
import { random } from "./utils";

const app = express();
app.use(express.json())



app.post("/api/v1/signup", async(req,res) => {
    const {username, password} = req.body;

    const userExist = await User.findOne({username})
    if(userExist){
        res.status(403).json("User already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const newUser = await User.create({
        username: username,
        password: hashedPassword
    })
    try {
        await newUser.save();
        const token = jwt.sign({
            id: newUser._id
        },JWT_SECRET_KEY)
        res.json({
            message: "User successfully created"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error saving user",
            error: (error as Error).message
        });
    }
    

})

app.post("/api/v1/signin", async(req,res)=>{
    const {username, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const existingUser = await User.findOne({username})
    if(!existingUser){
        res.json({
            message: "User does not exist"
        })
    }else{
        const compare = await bcrypt.compare(password,existingUser.password)
        if(compare){
            const token = jwt.sign({
                id: existingUser._id
            },JWT_SECRET_KEY)
            res.json({
                token: token,
                message: "Login successful"
            })
        }else{
            res.json({
                message: "Incorrect Password"
            })
        }
    }


})
//@ts-ignore
app.post("/api/v1/content", userAuthorization, async (req, res) => {
    const {link, type, title} = req.body;
    const userId = (req as any).userId
    const content = await Content.create({
        link: link,
        type: type,
        title: title,
        userId,
        tags: []
    })
    await content.save()
    res.json({
        message: "content added"
    })
    
})
//@ts-ignore
app.get("/api/v1/content",userAuthorization, async(req,res) => {
    const userId = (req as any).userId;
    const content = await Content.find({
        userId: userId
    }).populate("userId","username")
    res.json({
        content
    })
})
//@ts-ignore
app.delete("/api/v1/content",userAuthorization,async(req,res)=>{
    const contentId = req.body;
    
    const userId = (req as any).userId;
    await Content.deleteMany({
        contentId,
        userId
    })
    res.json({
        message: "Deleted"
    })

})
//@ts-ignore
app.post("/api/v1/brain/share",userAuthorization, async(req,res)=>{
    const {share} = req.body;
    if(share){
        const existingLink = await Link.findOne({
            userId: (req as any).userId
        })
        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash = random(10)
        await Link.create({
            userId: (req as any).userId,
            hash: hash
        })
        res.json({
            message: "/share/" + hash
        })
    } else{
        await Link.deleteOne({
            userId: (req as any).userId
        })
        res.json({
            message: "Removed link"
        })
    }
   

})
app.get("/api/v1/brain/:shareLink",async(req,res)=>{
    const hash = req.params.shareLink;

    const link = await Link.findOne({hash});
    if(!link){
        res.status(400).json({message: "Invalid share link"});
        return;
    }
    const content = await Content.find({userId: link.userId});
    const user = await User.findOne({_id: link.userId});

    if(!user){
        res.status(404).json({message: "User not found"})
    }
    res.json({
        username: user?.username,
        content
    })
})


app.listen(3000);