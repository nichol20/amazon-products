import express from "express";
import search from "./controllers/amazon/search";

const app = express();
const PORT = Bun.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({ message: "Hello from Bun + Express!" });
});

app.get("/api/scrape", search);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
