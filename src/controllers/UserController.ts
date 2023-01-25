import { Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/User";

class UserController {
  async store(request: Request, response: Response) {
    try {
      const { username, email, password } = request.body;

      const usernameAlreadyExists = await User.findOne({ username });

      if (usernameAlreadyExists) {
        return response
          .status(400)
          .json({ message: "Username already in use" });
      }

      const emailAlreadyExists = await User.findOne({ email });

      if (emailAlreadyExists) {
        return response.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return response.status(201).json(user);
    } catch (error) {
      return response.status(500).json({ message: "Server Internal Error" });
    }
  }
}

export default new UserController();