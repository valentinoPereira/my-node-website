require('dotenv-safe').config();
const { http } = require("./router");
const port = 8080;

http.listen(port, () => console.log(`Server is running on port ${port}`));
