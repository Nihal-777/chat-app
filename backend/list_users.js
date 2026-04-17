import { config } from "dotenv";
import { connectDB } from "./src/lib/db.js";
import User from "./src/models/user.model.js";
import fs from "fs";

config();

const run = async () => {
  await connectDB();
  const users = await User.find({});
  const result = users.map(u => ({ _id: u._id.toString(), fullName: u.fullName, email: u.email }));
  fs.writeFileSync("users_list.json", JSON.stringify(result, null, 2));
  process.exit(0);
};

run();
