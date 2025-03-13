import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import AppLayout from "./components/AppLayout";
import LoginForm from "./components/LoginForm";
import FilesPage from "./components/FilesPage";





export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'files', element: <FilesPage /> }
        ]
    }
])


