import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import AppLayout from "./components/AppLayout";
import LoginForm from "./components/LoginForm";
import FilesPage from "./components/FilesPage";
import UpdateUserForm from "./components/UpdateUserForm";
import FileUploader from "./components/FileUploader";





export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'files', element: <FilesPage /> },
            { path: 'fileUpload', element: <FileUploader /> },
            {path: 'update-user/:id', element: <UpdateUserForm />},
        ]
    }
])


