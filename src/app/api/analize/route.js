import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY })

const complete = async ({ messages, model }) => {
  try {
    const response = await openai.chat.completions.create({ messages, model })
    return response.choices[0].message.content
  } catch (error) {
    console.error('Error:', error)
    return error
  }
}

async function analisis (data) {
  if (!data) return

  const messages = [
    {
      role: 'system',
      content: `
        Comportate como un asistente de programación, 
        te voy a compartir preguntas y respuestas de un lenguaje de
        programación y debes generar un analisis cuantitativo.
        Responde solamente con un número del 0 al 10, donde 1 es la peor 
        nota y 10 la mejor.
        No agregues descripciones, explicaciones o cualquier otro tipo de 
        texto a las preguntas, ni tampoco a las respuesta que vas a generar`
    },
    {
      role: 'user', content: `
        [
          {
            "question": "¿Como se declara una variable?",
            "awnser": "let x = 1;"
          },
          {
            "question": "¿Como se declara una constante?",
            "awnser": "const x = 1;"
          },
          {
            "question": "¿Como se crea una función?",
            "awnser": "function x () { return 1; }"
          }
        ]`
    },
    { role: 'assistant', content: '10' },
    {
      role: 'user', content: `
      [
        {
          "question": "¿Que es JavaScript?",
          "awnser": "Es el lenguaje de programación Java pero con un sufijo script"
        },
        {
          "question": "¿JavaScript es lo mismo que Java?",
          "awnser": "Si, claro que si."
        },
        {
          "question": "¿De que color es el logo de JavaScript?",
          "awnser": "Rojo, morado y verde"
        }
      ]`
    },
    { role: 'assistant', content: '0' },
    {
      role: 'user',
      content: JSON.stringify(data)
    }
  ]

  return await complete({ messages, model: 'gpt-3.5-turbo' })
}

export async function POST (request) {
  const data = await request.json()
  try {
    const analize = await analisis(data)
    return Response.json(analize)
  } catch (error) {
    // enviar el error a un log
    return Response.json({ error: 'Error al generar las preguntas' })
  }
}
