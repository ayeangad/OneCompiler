import { createClient } from "redis"
import fs from "fs"
import { spawn } from "child_process"

const client = createClient()


client.connect()
  .then(async () => {
    while (1) {
      const response = await client.rPop("processing")
      if (!response) {
        await new Promise((r) => setTimeout(r, 1000))
        continue;
      }

      const parsedResponse = JSON.parse(response)
      const code = parsedResponse.code
      const language = parsedResponse.language

      if (language === "js") {
        const filePath = __dirname + "./code/a.js"
        fs.writeFileSync(filePath, code)
        const response = spawn("node", [filePath])
        response.stdout.on("data", (chunk) => {
          console.log(chunk.toString())
        })


      }



    }
  })



