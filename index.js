const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.get('/', (_, response) => {
  response.send('<h1>Hello World</h1>')
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`)
})
