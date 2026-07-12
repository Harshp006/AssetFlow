import express from "express";
import cors from "cors";

import assetRoutes from "./routes/asset.routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AssetFlow Backend Running 🚀");
});

app.use("/api/assets", assetRoutes);
app.use(errorMiddleware);

export default app;