import { type Request, type Response } from "express";
import { prisma } from "..";

export async function createMessage(req: Request, res: Response) {
  const { content, messageType, conversationId } = req.body;
  const { id } = req.query;

  if (!id || !content || !messageType || !conversationId) {
    return res.status(400).json({
      message: `${id === undefined && "Id"} ${
        conversationId === undefined && "Conversation Id "
      } ${content === undefined && "Content "} ${
        messageType === undefined && "Message Type is"
      } required for group.`,
    });
  }

  try {
    const message = await prisma.message.create({
      data: {
        content: content,
        type: messageType,
        sender: { connect: { id: id?.toString() } },
        conversation: { connect: { id: conversationId } },
      },
      include: {
        sender: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
    const formattedMessage = {
      id: message.id,
      content: message.content,
      type: message.type,
      name: message.sender.name,
      avatar: message.sender.avatar,
      time: message.createdAt,
      senderId: message.senderId,
    };

    res.status(201).json({
      message: "Message created successfully",
      data: formattedMessage,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({
      message: "An error occurred while creating the message",
      // error: error.message,
    });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  const { messageId } = req.params;
  const { id } = req.query;

  if (!id || !messageId) {
    return res.status(400).json({
      message: `${id === undefined && "Id"} ${
        messageId === undefined && "Message Id"
      } required for group.`,
    });
  }

  try {
    const message = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      message: "An error occurred deleting the message",
      // error: error.message,
    });
  }
}
