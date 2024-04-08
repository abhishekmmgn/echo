import { type Request, type Response } from "express";
import { prisma } from "..";
import type { ContactType, ConversationType } from "../types";

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

    res.status(200).json({
      message: "Successfully fetched conversations",
      data: conversations,
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
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId.toString(),
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
      // console.log(messages);
      if (conversation && messages) {
        return res.status(200).json({
          message: "Conversation found",
          data: {
            conversation,
            messages,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Error finding contact" });
  }
}
export async function createConversation(req: Request, res: Response) {
  const { participants, content, conversationType, name, avatar, messageType } =
    req.body;
  const { id } = req.query;

  console.log(
    participants,
    content,
    conversationType,
    name,
    avatar,
    messageType,
    id
  );
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

  const participantIds = [...participants, id?.toString()];

  console.log(participantIds);
  // return res.status(200);
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
          conversation,
        },
      });
    } else if (conversationType === "PRIVATE") {
      let conversation = await prisma.conversation.findFirst({
        where: {
          type: "PRIVATE",
          AND: [
            {
              participants: {
                some: { id: participantIds[0] },
              },
            },
            {
              participants: {
                some: { id: participantIds[1] },
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
              connect: [{ id: participantIds[0] }, { id: participantIds[1] }],
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
              contactId: participantIds[0],
            },
          },
          data: {
            hasConversation: true,
          },
        });

        return { conversation, message };
      });

      res.status(201).json({
        message: "Conversation created successfully",
        data: {
          conversation: result.conversation,
          messages: [result.message],
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
  const contactId = req.params.id;
  const currentUserId = req.query.id;

  if (!currentUserId || !contactId) {
    return res.status(400).json({
      message: "Id and email required",
    });
  }
  try {
    // Delete the contact relationship
    const deletedContact = await prisma.contact.deleteMany({
      where: {
        userId: currentUserId.toString(),
        contactId: contactId,
      },
    });

    // Check if any record was deleted
    if (deletedContact.count === 0) {
      console.log("No contact found to delete");
    } else {
      console.log("Contact deleted successfully");
    }

    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

export async function editContact(req: Request, res: Response) {
  const contactId = req.params.id;
  const currentUserId = req.query.id;
  const { hasConversation, block } = req.body;

  console.log(currentUserId, contactId);
  if (!currentUserId || !contactId) {
    return res.status(400).json({
      message: "Id and email required",
    });
  }
  // Build the data object conditionally
  const dataToUpdate: { [key: string]: any } = {};
  if (block !== undefined) {
    dataToUpdate.blocked = block;
  }
  if (hasConversation !== undefined) {
    dataToUpdate.hasConversation = hasConversation;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({
      message: "No valid fields provided to update",
    });
  }

  try {
    const updatedContact = await prisma.contact.updateMany({
      where: {
        userId: currentUserId.toString(),
        contactId: contactId,
      },
      data: dataToUpdate,
    });

    // Check if any record was updated
    if (updatedContact.count === 0) {
      console.log("No contact found to update");
    } else {
      console.log("Contact updated successfully");
    }
    return res.status(200).json({
      message: `Contact ${
        block !== undefined ? (block ? "blocked" : "unblocked") : "updated"
      } successfully`,
      updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}
