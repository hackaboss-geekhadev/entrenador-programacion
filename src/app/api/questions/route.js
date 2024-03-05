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

async function genetare (lang) {
  if (!lang) return

  const messages = [
    {
      role: 'system',
      content: `
        Comportate como un asistente de programación, 
        te voy a compartir mi lenguaje de programación favorito y 
        debes generar tres preguntas que consideres idoneas para
        entrenar mis conocimientos en el lengueje seleccionado.
        Se breve en las preguntas, que no excedan de 140 caracteres.
        Responde siempre en español. Responde siempre en un formato Json, 
        las preguntas deben venir de la siguiente formal:
        [
          '¿Pregunta 1?', 
          '¿Pregunta 2?', 
          '¿Pregunta 3?',
        ]

        No agregues descripciones, explicaciones o cualquier otro tipo de 
        texto a las preguntas, ni tampoco a las respuesta que vas a generar`
    },
    { role: 'user', content: 'Languaje: JavaScript' },
    {
      role: 'assistant',
      content: `
        [
          "¿Cómo se declara una variable constante en JavaScript?",
          "¿Qué método usarías para convertir un JSON a un objeto en JavaScript?",
          "¿Cómo se crea una promesa en JavaScript?"
        ]
      `
    },
    { role: 'user', content: 'Languaje: Python' },
    {
      role: 'assistant',
      content: `
        [
          "¿Cómo se declara una variable en Python?",
          "¿Como imprimir un valor en Python?",
          "¿Cómo se crea una función en Python?"
        ]
      `
    },
    { role: 'user', content: `Lenguaje: ${lang}` }
  ]

  return await complete({ messages, model: 'gpt-3.5-turbo' })
}

export async function GET (request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang')

  try {
    const questions = await genetare(lang)
    return Response.json(JSON.parse(questions))
  } catch (error) {
    // enviar el error a un log
    console.log('Error:', error)
    return Response.json({ error: 'No se pudo generar las preguntas' })
  }
}
