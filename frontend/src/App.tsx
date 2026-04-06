import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TalkVote from './pages/TalkVote'
import Live from './pages/Live'
import TalkLive from './pages/TalkLive'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/talk/:slug" element={<TalkVote />} />
        <Route path="/live" element={<Live />} />
        <Route path="/talk/:slug/live" element={<TalkLive />} />
      </Routes>
    </BrowserRouter>
  )
}
