import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout.jsx";
import Home from "./components/Pages/Home.jsx";
import BgChanger from "./components/Pages/BgChanger.jsx";
import CurrencyConvertor from "./components/Pages/CurrencyConvertor.jsx";
import PasswordGenerator from "./components/Pages/PasswordGenerator.jsx";
import Github, { gitHubInfoLoader } from "./components/Pages/Github.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import { ThemeContextProvider } from "./context/ThemeContext.jsx";
import Todos from "./components/Pages/Todos.jsx";

const setLight = () => {
  document.body.classList.toggle("light", isDark);
};





// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "/bg-changer",
//         element: <BgChanger />,
//       },
//       {
//         path: "/password-generator",
//         element: <PasswordGenerator />,
//       },
//       {
//         path: "/currency-convertor",
//         element: <CurrencyConvertor />,
//       },
//       {
//         path: "*",
//         element: <h1>404</h1>,
//       },
//     ],
//   },
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/bg-changer" element={<BgChanger />} />
      <Route path="/password-generator" element={<PasswordGenerator />} />
      <Route path="/currency-convertor" element={<CurrencyConvertor />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/github" loader={gitHubInfoLoader} element={<Github />} />
      <Route path="*" element={<h1>404</h1>} />
    </Route>,
  ),
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeContextProvider>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </ThemeContextProvider>
  </StrictMode>,
);
