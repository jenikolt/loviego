const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, "public")));

// Отправка HTML страницы
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
