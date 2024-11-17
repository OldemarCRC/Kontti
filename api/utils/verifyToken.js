import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(createError(403, "Token not provided"));
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createError(403, "Token not provided"));
  }
  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return next(createError(401, "Unauthorized"));
    }
    req.userId = decoded.id;
    next();
  });
};




export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
  next();
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
  next();
};
