import app from "./app.js";
import { connectDB } from "./config/db.js";

connectDB()
    .then(() => {
        app.listen(8000, () => {
            console.log("Server is running on port 8000");
        });
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
    });