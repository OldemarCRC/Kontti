import jwt from "jsonwebtoken";
import { createError } from "../services/errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(403, "Token not provide"));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.userId = decoded.id;
    
    req.user = {
      id: decoded.id,
      role: decoded.role, 
    };
    
    next();
  } catch (err) {
    return next(createError(401, "Unauthorized"));
  }
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
