'use client'

import { useState } from 'react'
import { Pacifico } from 'next/font/google'
import confetti from 'canvas-confetti'

const especialFont = Pacifico({ subsets: ['latin'], weight: '400' })

const LANGS = ['JavaScript', 'TypeScript', 'Python', 'PHP']

export default function Home () {
  const [lang, setLang] = useState()
  const [questions, setQuestions] = useState([])
  const [calification, setCalification] = useState(null)

  const handleChangeLang = (e) => {
    if (!e.target.value === '') return

    setLang(e.target.value)

    fetch(`/api/questions?lang=${e.target.value}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const form = []
    for (const [key, value] of data) {
      const indexQuestions = key.split('-')[1]
      form.push({
        question: questions[indexQuestions],
        awnser: value
      })
    }

    fetch('/api/analize', {
      method: 'POST',
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then((data) => {
        setCalification(data)
        if (data > 5) confetti()
      })
  }

  return (
    <>
    <div className="fixed h-full w-full bg-black">
      <div className="absolute bottom-0 left-[-15%] right-0 top-[-10%] h-[700px] w-[600px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,213,220,.15),rgba(255,255,255,0))]"></div>
      <div className="absolute bottom-0 right-[-30%] top-[40%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,213,220,.15),rgba(255,255,255,0))]"></div>
    </div>

    <main className="flex flex-col p-24 zIndex-10 absolute max-w-3xl mx-auto inset-0">
      <h1 className={`text-6xl bg-gradient-to-r from-cyan-500 to-blue-800 bg-clip-text text-transparent ${especialFont.className}`}>
        EntrenIA
      </h1>
      <p className="text-xl text-gray-400 text-balance border-b-2 border-opacity-20 border-cyan-500 pb-12 mt-6 mb-10">
        Valida tus conocimientos en programación, con un asistente de inteligencia artificial.
      </p>

      {calification !== null && (
        <section className="mt-6">
          <h2 className={
            `font-bold text-4xl ${
              calification > 5 ? 'text-green-600' : 'text-red-600'
            }`
          }>Calificación: {calification}</h2>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <label className="text-2xl font-bold text-gray-400">Lenguajes de programación:</label>
        <select
          value={lang}
          onChange={handleChangeLang}
          className="p-4 border border-gray-300 rounded-md text-gray-700">
          <option value="">Selecciona un lenguaje de programación</option>
          {LANGS.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </section>

      {questions.length > 0 && (
        <section className="mt-6">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-400">Preguntas:</h2>
            <ul className="mt-4 flex flex-col gap-8">
              {questions.map((question, index) => (
                <li key={question} className="text-lg flex flex-col">
                  <span className="text-cyan-500">{question}</span>
                  <input
                    type="text"
                    className="p-2 py-3 mt-2 border border-gray-300 rounded-md text-gray-600"
                    name={`awser-${index}`}
                    placeholder="Responde aquí..."
                  />
                </li>
              ))}
            </ul>
            <button
              type="submit"
              className="mt-6 p-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-800 text-white font-bold rounded-md">
              Enviar respuestas
            </button>
          </form>
        </section>
      )}

      <footer className="text-center text-gray-400 fixed bottom-0 pb-12">
        <img
          src="https://assets-global.website-files.com/5f3108520188e7588ef687b1/620e82ff8680cd26532fff29_Logotipo%20HACK%20A%20BOSS_white%20100%20px.svg"
          alt="HACK A BOSS Logo" className="h-6 inline" />
        <span className="ml-2">
          Hecho con ❤️ por
          <a href="https://geekha.dev" target="__blank" className="text-cyan-500"> @geekhadev </a>
          &
          <a href="https://hackaboss.com" target="__blank" className="text-cyan-500"> @hackaboss</a>.
        </span>
      </footer>
    </main>
    </>
  )
}
