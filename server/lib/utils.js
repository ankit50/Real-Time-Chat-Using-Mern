import jwt from "jsonwebtoken";
//function to generate token for user

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWY_SECRET);
};
