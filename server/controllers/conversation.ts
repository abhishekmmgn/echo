import { type Request, type Response } from "express";
import { prisma } from "..";
import type { ConversationType } from "../types";

export async function getAllConversations(req: Request, res: Response) {
  const { id } = req.query;
  console.log(id);
  try {
    if (!id) {
      return res.status(400).json({
        message: "Id required",
      });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: id.toString(),
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            content: true,
            type: true,
            sender: {
              select: {
                name: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    const formattedConversations: ConversationType[] = conversations.map(
      (convo) => {
        let name = convo.name;
        let avatar = convo.avatar;

        if (convo.type === "PRIVATE") {
          const otherParticipant = convo.participants.find(
            (p) => p.id !== id.toString()
          );
          if (otherParticipant) {
            name = otherParticipant.name;
            avatar = otherParticipant.avatar;
          }
        }
        return {
          name: name!,
          avatar,
          lastMessage: convo.messages[0]?.content || "",
          lastMessageType: convo.messages[0]?.type,
          lastMessageTime:
            convo.messages[0]?.createdAt.toString() ||
            convo.createdAt.toString(),
          id: convo.id,
          type: convo.type,
        };
      }
    );
    res.status(200).json({
      message: "Successfully fetched conversations",
      data: formattedConversations,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversations" });
  }
}

export async function getConversation(req: Request, res: Response) {
  const { id, conversationId, otherUserId } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Id required",
    });
  }
  if (!conversationId && !otherUserId) {
    return res.status(400).json({
      message: `${otherUserId === undefined && "Other user id"} ${
        conversationId === undefined && conversationId
      } required`,
    });
  }
  try {
    let conversation;
    // console.log("C: ",    conversationId);
    // return res.status(200);
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId.toString(),
        },
        include: {
          participants: true,
        },
      });
    } else if (otherUserId) {
      conversation = await prisma.conversation.findFirst({
        where: {
          type: "PRIVATE",
          AND: [
            {
              participants: {
                some: { id: otherUserId.toString() },
              },
            },
            {
              participants: {
                some: { id: id.toString() },
              },
            },
          ],
        },
        include: {
          participants: true,
        },
      });
    }
    const messages = await prisma.message.findMany({
      where: {
        conversation: {
          id: conversation?.id,
        },
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
    if (conversation && messages) {
      let name = conversation.name;
      let avatar = conversation.avatar;

      if (conversation.type === "PRIVATE") {
        const otherParticipant = conversation.participants.find(
          (p) => p.id !== id.toString()
        );
        if (otherParticipant) {
          name = otherParticipant.name;
          avatar = otherParticipant.avatar;
        }
      }
      const formattedConversation = {
        id: conversation.id,
        name: name!,
        avatar,
        type: conversation.type,
      };
      const formattedMessages = messages.map((message) => {
        return {
          id: message.id,
          content: message.content,
          type: message.type,
          name: message.sender.name,
          avatar: message.sender.avatar,
          time: message.createdAt,
          senderId: message.senderId,
        };
      });

      return res.status(200).json({
        message: "Conversation found",
        data: {
          conversation: formattedConversation,
          messages: formattedMessages,
        },
      });
    }
    return res.status(404).json({
      message: "Conversation not found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error finding contact" });
  }
}
export async function getConversationDetails(req: Request, res: Response) {
  const { conversationId } = req.params;
  const { id } = req.query;

  if (!conversationId && !id) {
    return res.status(400).json({
      message: `${id === undefined && "User id"} ${
        conversationId === undefined && conversationId
      } required`,
    });
  }
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    });
    // console.log(messages);
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }
    if (conversation) {
      // find all message of type file
      const messages = await prisma.message.findMany({
        where: {
          conversation: {
            id: conversation?.id,
          },
          type: {
            in: ["FILE", "IMAGE"],
          },
        },
      });
      const files: string[] = messages.map((message) => message.content);
      return res.status(200).json({
        message: "Conversation found",
        data: {
          participants: conversation.participants,
          isAdmin: conversation.creatorId === id?.toString(),
          files,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error finding contact" });
  }
}
export async function createConversation(req: Request, res: Response) {
  const { participants, content, conversationType, name, avatar, messageType } =
    req.body;
  const { id } = req.query;

  // valiadtion for group & private conversation
  if (
    conversationType === "GROUP" &&
    (!id || !participants || !name || !conversationType)
  ) {
    return res.status(400).json({
      message: `${id === undefined && "Id"} ${
        participants === undefined && "Participants are"
      } ${name === undefined && "Name of group is"} ${
        conversationType === undefined && "Type of conversation is"
      } required for group.`,
    });
  } else if (
    conversationType === "PRIVATE" &&
    (!id || !participants || !content || !conversationType || !messageType)
  ) {
    return res.status(400).json({
      message: `${id === undefined && "Id"} ${
        participants === undefined && "Participants are"
      } ${content === undefined && "Message content is"}  ${
        conversationType === undefined && "Conversation type is"
      } ${
        conversationType === undefined && "Type of conversation is"
      } required for private conversation.`,
    });
  }

  const participantIds = [...participants, id?.toString()].map((id) => ({
    id,
  }));

  try {
    if (conversationType === "GROUP") {
      const conversation = await prisma.conversation.create({
        data: {
          name: name,
          avatar: avatar || null,
          type: "GROUP",
          createdBy: { connect: { id: id?.toString() } },
          participants: { connect: participantIds },
        },
      });

      if (!conversation) {
        // conversation not created
        return res.status(500).json({
          message: "Failed to create group",
        });
      }

      return res.status(200).json({
        message: "Group created successfully",
        data: {
          conversationId: conversation.id,
        },
      });
    } else if (conversationType === "PRIVATE") {
      let conversation = await prisma.conversation.findFirst({
        where: {
          type: "PRIVATE",
          AND: [
            {
              participants: {
                some: { id: participantIds[0].toString() },
              },
            },
            {
              participants: {
                some: { id: participantIds[1].toString() },
              },
            },
          ],
        },
      });
      const messages = await prisma.message.findMany({
        where: {
          conversation: {
            id: conversation?.id,
          },
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

      if (conversation && messages) {
        return res.status(200).json({
          message: "Conversation found",
          data: {
            conversation,
            messages,
          },
        });
      }
      const result = await prisma.$transaction(async (prisma) => {
        const conversation = await prisma.conversation.create({
          data: {
            type: "PRIVATE",
            participants: {
              connect: participantIds,
            },
            createdBy: { connect: { id: id?.toString() } },
          },
        });

        const message = await prisma.message.create({
          data: {
            content: content,
            type: messageType,
            sender: { connect: { id: id?.toString() } },
            conversation: { connect: { id: conversation.id } },
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
        await prisma.contact.update({
          where: {
            userId_contactId: {
              userId: id?.toString()!,
              contactId: participantIds[0].toString(),
            },
          },
          data: {
            hasConversation: true,
          },
        });

        return { conversation, message };
      });

      const formattedConversation = {
        id: conversation?.id!,
        name: name!,
        avatar,
        type: conversation?.type,
      };
      const formattedMessage = {
        id: result.message.id,
        content: result.message.content,
        type: result.message.type,
        name: result.message.sender.name,
        avatar: result.message.sender.avatar,
        time: result.message.createdAt,
        senderId: result.message.senderId,
      };

      return res.status(201).json({
        message: "Conversation created successfully",
        data: {
          conversation: formattedConversation,
          messages: formattedMessage,
        },
      });
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      message: "An error occurred while creating the conversation",
      // error: error.message,
    });
  }
}
export async function deleteConversation(req: Request, res: Response) {
  const conversationId = req.params.id;

  if (!conversationId) {
    return res.status(400).json({
      message: "Conversation Id required",
    });
  }

  try {
    // Fetch the conversation type and participants
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    await prisma.$transaction(async (prisma) => {
      // Delete all messages related to the conversation
      await prisma.message.deleteMany({
        where: { conversationId },
      });

      // Delete the conversation
      await prisma.conversation.delete({
        where: { id: conversationId },
      });

      // If the conversation is private, update hasConversation for participants
      if (conversation.type === "PRIVATE") {
        const participantIds = conversation.participants.map((p) => p.id);
        await prisma.contact.updateMany({
          where: {
            id: { in: participantIds },
          },
          data: {
            hasConversation: false,
          },
        });
      }
    });

    return res.status(200).json({
      message: "Conversation and all related messages deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({
      message:
        "Failed to delete conversation and related messages. error occurred while creating the conversation",
      error,
    });
    throw new Error("");
  }
}

export async function editConversation(req: Request, res: Response) {
  const id = req.query.id;
  const { operation, conversationId, avatar, name } = req.body;

  if (!id || !operation || !conversationId) {
    return res.status(400).json({
      message: "Id, conversation id and operation are required",
    });
  }
  console.log("Here.");

  if (operation === "EXIT_GROUP") {
    try {
      // Fetch the conversation type and participants
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: true,
        },
      });

      if (!conversation) {
        return res.status(404).json({
          message: "Conversation not found",
        });
      }

      // Start a transaction to ensure atomicity
      await prisma.$transaction(async (prisma) => {
        if (conversation.type === "GROUP") {
          await prisma.conversation.update({
            where: { id: conversationId },
            data: {
              participants: {
                disconnect: { id: id.toString() },
              },
            },
          });
        }
      });
      return res.status(200).json({
        message: "Exited the group successfully.",
      });
    } catch (error) {
      console.error("Error exiting the group:", error);
      res.status(500).json({
        message: "Error exiting the group.",
        error,
      });
    }
  } else if (operation === "EDIT_DETAILS") {
    try {
      let dataToBeUpdated = {};
      if (name !== undefined) {
        dataToBeUpdated = { ...dataToBeUpdated, name };
      }
      if (avatar !== undefined) {
        dataToBeUpdated = { ...dataToBeUpdated, avatar };
      }

      await prisma.conversation.update({
        where: { id: conversationId },
        data: dataToBeUpdated,
      });
      return res.status(200).json({
        message: "Conversation details updated successfully.",
      });
    } catch (error) {
      console.error("Error exiting the group:", error);
      res.status(500).json({
        message: "Error exiting the group.",
        error,
      });
    }
  } else if (operation === "EDIT_PARTICIPANTS") {
    try {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          participants: {
            disconnect: { id: id.toString() },
          },
        },
      });
      return res.status(200).json({
        message: "Exited the group successfully.",
      });
    } catch (error) {
      console.error("Error exiting the group:", error);
      res.status(500).json({
        message: "Error exiting the group.",
        error,
      });
    }
  }
}
