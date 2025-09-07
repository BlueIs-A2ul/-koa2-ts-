import env from "./config/config.default"
import app from "./app/index"

const APP_PORT = env.APP_PORT

app.listen(APP_PORT, () => {
  console.log(`server is listening on http://localhost:${APP_PORT}`)
})