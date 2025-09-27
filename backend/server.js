const express = require("express")
const cors = require("cors");
const { exec } = require("child_process");
const GitRouter = require("./routers/gitRouter.js")
const app = express();

app.use(cors());

app.use(express.json());

app.use("/",GitRouter)

const PORT = "5001";
app.listen(PORT, () => {
	console.log(`Runing port ${PORT}`);
})

