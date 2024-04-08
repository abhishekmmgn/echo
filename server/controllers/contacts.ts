import { type Request, type Response } from "express";
import { prisma } from "..";
import type { ContactType } from "../types";

export async function getAllContacts(req: Request, res: Response) {
  const { id } = req.query;
  console.log(id);
  try {
    if (!id) {
      return res.status(400).json({
        message: "Id required",
      });
    }
    const contacts = await prisma.contact.findMany({
      where: {
        userId: id.toString(),
      },
      select: {
        contact: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        blocked: true,
        hasConversation: true,
      },
    });

    // Format the response to match ContactType
    const formattedContacts: ContactType[] = contacts.map((contact) => ({
      id: contact.contact.id,
      email: contact.contact.email,
      name: contact.contact.name,
      avatar: contact.contact.avatar,
      blocked: contact.blocked,
      hasConversation: contact.hasConversation,
    }));
    res.status(200).json({
      message: "Successfully fetched contacts",
      data: formattedContacts,
    });
  } catch (error) {
    res.status(500).json({ error: "Error finding contacts" });
  }
}

export async function getContact(req: Request, res: Response) {
  const { contactId } = req.params;
  try {
    if (!contactId) {
      return res.status(400).json({
        message: "Id required",
      });
    }
    const contact = await prisma.user.findUnique({
      where: {
        id: contactId.toString(),
      },
    });
    res.status(200).json({
      message: "Successfully fetched contact",
      data: {
        name: contact?.avatar,
        avatar: contact?.avatar,
        email: contact?.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error finding contact" });
  }
}
export async function newContact(req: Request, res: Response) {
  const { email } = req.body;
  const { id } = req.query;

  try {
    if (!id || !email) {
      return res.status(400).json({
        message: "Id and email required",
      });
    }
    const otherUser = await prisma.user.findUnique({
      where: {
        email: email.toString(),
      },
    });
    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the contact already exists
    const existingContact = await prisma.contact.findUnique({
      where: {
        userId_contactId: {
          userId: id.toString(),
          contactId: otherUser.id,
        },
      },
    });
    if (existingContact) {
      return res.status(409).json({ error: "Contact already exists" });
    }

    // Create the new contact
    const newContact = await prisma.contact.create({
      data: {
        userId: id.toString(),
        contactId: otherUser.id,
        blocked: false,
        hasConversation: false,
      },
    });

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Error creating contact" });
  }
}

export async function deleteContact(req: Request, res: Response) {
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
