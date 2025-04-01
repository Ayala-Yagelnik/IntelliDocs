import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import AppLayout from "./components/AppLayout";
import AuthForm from "./components/AuthForm";
import UpdateUserForm from "./components/UpdateUserForm";
import FileList from "./components/FileList";
import SharedFilesList from "./components/SharedFilesList";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";





export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'login', element: <AuthForm /> },
            { path: 'register', element: <AuthForm isRegister={true} /> },
            { path: 'files', element: <FileList /> },
            { path: 'files-shared', element: <SharedFilesList /> },
            { path: 'update-user/:id', element: <UpdateUserForm /> },
            { path: 'privacy-policy', element: <PrivacyPolicy /> },
            { path: 'terms-of-service', element: <TermsOfService /> },
        ]
    }
])


