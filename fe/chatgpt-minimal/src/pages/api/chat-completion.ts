import { Message } from '@/models'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

export const config = {
  runtime: 'edge'
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages } = (await req.json()) as {
      messages: Message[]
    }

    const charLimit = 12000
    let charCount = 0
    let messagesToSend = []

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      if (charCount + message.message.length > charLimit) {
        break
      }
      charCount += message.message.length
      messagesToSend.push(message)
    }

    let apiBaseUrl = "" + process.env.URL
    const stream = await ChatStream(apiBaseUrl, messagesToSend)

    return new Response(stream)
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}

const ChatStream = async (apiUrl: string, messages: Message[]) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      messages: [
        {
          message: "System message", type: "system"
        },
        ...messages
      ]
    })
  })

  if (res.status !== 200) {
    const statusText = res.statusText
    throw new Error(
      `The API has encountered an error with a status code of ${res.status} and message ${statusText}`
    )
  }
  const resa = await res.json()
  console.log(resa.at(-1))
  console.log(resa.at())

  return resa.at(-1)['message']
}
export default handler
