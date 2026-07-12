import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import assetManagerRoutes from "./routes/assetManager.routes";
import deptHeadRoutes from "./routes/deptHead.routes";
import employeeRoutes from "./routes/employee.routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "AssetFlow Backend Running 🚀" });
});

// Authentication (public + employee management)
app.use("/api/auth", authRoutes);

// Role-specific routes
app.use("/api/asset-manager", assetManagerRoutes);
app.use("/api/dept-head", deptHeadRoutes);
app.use("/api/employee", employeeRoutes);

app.use(errorMiddleware);

export default app;