import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import AppLayout from "./components/AppLayout";
import AuthForm from "./components/AuthForm";
import UpdateUserForm from "./components/UpdateUserForm";
import FileUploader from "./components/FileUploader";





export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'login', element: <AuthForm /> },
            { path: 'register', element: <AuthForm isRegister={true} /> },
            { path: 'fileUpload', element: <FileUploader /> },
            {path: 'update-user/:id', element: <UpdateUserForm />},
        ]
    }
])


