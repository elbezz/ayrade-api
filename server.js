const express = require("express");
const userRoutes = require("./src/user/routes");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hi there!!!!!!!");
});
app.use("/api/users", userRoutes);
app.listen(port, () => console.log(`server is listenig on port: ${port}`));
