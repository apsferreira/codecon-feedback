import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TalksListPage } from '@/pages/talks-list-page'
import { VotePage } from '@/pages/vote-page'
import { ResultsPage } from '@/pages/results-page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TalksListPage />} />
          <Route path="/talks/:slug/vote" element={<VotePage />} />
          <Route path="/talks/:slug/results" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
