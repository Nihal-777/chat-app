import { config } from "dotenv";
import { connectDB } from "./src/lib/db.js";
import User from "./src/models/user.model.js";
import Message from "./src/models/message.model.js";

config();

const run = async () => {
  try {
    await connectDB();
    const keepIds = ["69d29c96c987cf057c2d62e3", "69d2a60aec8761bec5c48ea6"];
    
    // Delete users NOT in the keepIds array
    const userResult = await User.deleteMany({ _id: { $nin: keepIds } });
    console.log(`Deleted ${userResult.deletedCount} users.`);

    // Delete all messages
    const messageResult = await Message.deleteMany({});
    console.log(`Deleted ${messageResult.deletedCount} messages.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
