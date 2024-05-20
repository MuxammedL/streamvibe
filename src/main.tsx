import ReactDOM from 'react-dom/client'

import "../src/styles/main.scss"
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/index.tsx'
import { DataProvider } from './context/DataContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <DataProvider>
    <RouterProvider router={routes} />
  </DataProvider>
)
