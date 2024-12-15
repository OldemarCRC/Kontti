import User from "./userModel.js";

export const onLineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.find({ isOnLine: true });
    res.status(200).json(onlineUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isOnLine: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};