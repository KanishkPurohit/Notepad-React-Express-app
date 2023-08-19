const connectToMongo = require('./db');
const express = require('express')
connectToMongo();
const app = express()
const port = 5000

app.use(express.json());  //using miidleware to solvee the undefined error of req.body
//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})