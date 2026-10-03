import User from "../models/user.model.js";

export const loginUser = async (req, res) => {
  try {
    const { email, name, image } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      await user.update({
        name,
        image,
      });
    } else {
      user = await User.create({
        name,
        email,
        image,
        password_hash: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};