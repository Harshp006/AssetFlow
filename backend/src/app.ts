import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import assetRoutes from "./routes/asset.routes";
import maintenanceRoutes from "./routes/maintenance.routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Register authentication routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("AssetFlow Backend Running 🚀");
});

app.use("/api/assets", assetRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use(errorMiddleware);

export default app;