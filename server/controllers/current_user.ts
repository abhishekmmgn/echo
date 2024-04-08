import { type Request, type Response } from "express";
import { prisma } from "..";

export async function createNewUser(req: Request, res: Response) {
  // create a new user
  const { name, email, avatar } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email required" });
  }
  // check if user already exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    return res.status(409).json({
      message: "User already exists",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  }
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        avatar,
      },
    });

    if (!newUser) {
      return res.status(500).json({ error: "Failed to create user" });
    }
    res.status(201).json({
      message: "User created successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
}

export async function getBasicDetails(req: Request, res: Response) {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  // find the user using email
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toString(),
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "Successfully fetched user details",
      data: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user details",
    });
  }
}

export async function updateProfile(req: Request, res: Response) {
  const { name, avatar } = req.body;
  const id = req.query.id;

  console.log(name, avatar, id);
  if (!id) {
    return res.status(400).json({ error: "Id required" });
  }
  try {
    // update user
    const updatedUser = await prisma.user.update({
      where: {
        id: id.toString(),
      },
      data: {
        name: name,
        avatar: avatar,
      },
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "Successfully fetched user details",
      data: {
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user details",
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: "Id required" });
  }
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: id.toString(),
      },
    });
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
}
