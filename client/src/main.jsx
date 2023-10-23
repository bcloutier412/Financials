import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from './app/store.js'
import { Provider } from 'react-redux'

import ErrorPage from './error-page.jsx';
import Home from './components/home/Home.jsx'
import Login from './components/login/Login.jsx'
import Register from './components/login/Register.jsx'
import { redirect } from "react-router-dom";

// Components
import Dashboard from './components/home/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <Home />,
        loader: () => {

          return null
        },
        children: [
          {
            path: "",
            element: <Dashboard />
          },
          {
            path: "assets",
            element: <div>Assets</div>
          },
          {
            path: "news",
            element: <div>News</div>
          }
        ]
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "",
        loader: () => {
          return redirect("/home");
        }
      }
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);