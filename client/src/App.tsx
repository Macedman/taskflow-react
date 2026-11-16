import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState('Hello Josie Mae!')

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-600">{count}</h1>
    </>
  )
}

export default App
