import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("=====================================");
    console.log("🚀 AssetFlow Backend Started");
    console.log(`🌐 Server running at http://localhost:${PORT}`);
    console.log("=====================================");
});