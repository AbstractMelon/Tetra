import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import communitiesRoutes from "./routes/communities";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tetra");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/communities", communitiesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
