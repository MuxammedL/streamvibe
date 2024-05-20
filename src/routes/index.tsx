import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home/Home"
import MoviesShows from "../pages/Movies&Shows/Movies&Shows"
import NotFound from "../pages/NotFound/NotFound"
import Support from "../pages/Support/Support"
import Subscriptions from "../pages/Subscriptions/Subscriptions"
import Layout from "../layout"

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'movies&shows',
                element: <MoviesShows />
            },
            {
                path: 'subscriptions',
                element: <Subscriptions />
            },
            {
                path: 'support',
                element: <Support />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
])
