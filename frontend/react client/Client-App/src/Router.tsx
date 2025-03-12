import { createBrowserRouter } from "react-router";
// import About from "./components/About";
import Home from "./components/Home";
import AppLayout from "./components/AppLayout";
import LoginForm from "./components/LoginForm";
import FilesPage from "./components/FilesPage";
// import RecipeList from "./components/RecipeList";
// import Error from "./components/Error";





export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        // errorElement:<><Error></Error></>,
        children: [
            { path: '/', element: <Home/> },
            { path: 'login', element: <LoginForm /> },
            { path: 'files', element: <FilesPage /> }

            
           ]
    }
])


