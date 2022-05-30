const express = require("express")
const Gun = require("gun")
const colors = require("colors")

const app = express()
const NODE_ENV = process.env.NODE_ENV || "development"
app.use(Gun.serve)
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(
    `App is listening on port ${PORT} at in ${NODE_ENV} mode.`.cyan.bold
  )
})

Gun({ web: server })
