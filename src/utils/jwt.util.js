import jwt from 'jsonwebtoken';

export const generateToken = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
