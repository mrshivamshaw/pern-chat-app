import { Request,Response } from "express";
import { prisma } from "../db/prisma";

export const sendMessage = async(req : Request, res : Response) => {
    try {
        const {id:reciversid} = req.params;
        const {message} = req.body;
        const senderId = req.user.id;
        // console.log(reciversid, message, senderId);
        
        if(!senderId || !message || !reciversid){
            return res.status(400).json({message : "All fields are required", success : false});
        }

        let conversation = await prisma.conversations.findFirst({
            where : {
                participantsid:{
                    hasEvery : [senderId, reciversid]
                }
            }
        })

        if(!conversation){
            conversation = await prisma.conversations.create({
                data: {
                    participantsid : [senderId, reciversid]
                }
            })
        }

        const newMessage = await prisma.message.create({
            data : {
                senderid : senderId,
                body : message,
                conversationid : conversation.id
            }
        })

        if(newMessage){
            conversation = await prisma.conversations.update({
                where :{
                    id : conversation.id
                },
                data:{
                    messages:{
                        connect:{
                            id: newMessage.id
                        }
                    }
                }
            })
        }


        return res.status(200).json({message : "Message sent successfully", success : true, data : newMessage});

    } catch (error: any) {
        console.log("Catch Error in sendMessage controller", error);
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const getMessages = async(req : Request, res : Response) => {
    try {
        const {id:uerToChat} = req.params;
        const userId = req.user.id;

        if(!uerToChat || !userId){  
            return res.status(400).json({message : "All fields are required", success : false});
        }

        const conversation = await prisma.conversations.findFirst({
            where : {
                participantsid:{
                    hasEvery : [userId, uerToChat]
                },
            },
            include: {
                messages:{
                    orderBy: {
                        createdat: "asc"
                    }
                }
            }
        })

        if(!conversation){
            return res.status(404).json({message : "Conversation not found", success : false});
        }

        return res.status(200).json({message : "Conversation found", success : true, data : conversation});
        
    } catch (error: any) {
        console.log("Catch Error in getMessages controller", error);
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const getUserForChat = async(req : Request, res : Response) => {
    try {
        const userId = req.user.id;
        const users = await prisma.user.findMany({
            where : {
                id : {
                    not : userId
                }
            },
            select : {
                id : true,
                username : true,
                firstname : true,
                lastname : true,
                profilepic : true
            }
        })  

        return res.status(200).json({message : "Users found", success : true, data : users});
    } catch (error: any) {
        console.log("Error in getUserForChat controller", error);
        return res.status(500).json({ message: error.message, success: false });
        
    }
}