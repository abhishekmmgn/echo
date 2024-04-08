import { type NextFunction, type Request, type Response } from "express";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.query;
  if (uid) {
    // check if it exits
    
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};