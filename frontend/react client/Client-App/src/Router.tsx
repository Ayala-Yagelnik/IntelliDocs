import { createBrowserRouter } from "react-router";
import AppLayout from "./components/AppLayout";
import UpdateUserForm from "./components/UpdateUserForm";
import SharedFilesList from "./components/Contents/SharedFilesList";
import PrivacyPolicy from "./components/Authentication/PrivacyPolicy";
import TermsOfService from "./components/Authentication/TermsOfService";
import AuthForm from "./components/Authentication/AuthForm";
import FileList from "./components/Contents/FileList";
import DeletedFiles from "./components/Contents/DeletedFiles";
import { Home } from "./components/HomePage/Home";

export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'login', element: <AuthForm /> },
            { path: 'register', element: <AuthForm isRegister={true} /> },
            { path: 'files', element: <FileList /> },
            { path: 'files-shared', element: <SharedFilesList /> },
            { path: 'trash', element: <DeletedFiles /> },
            { path: 'update-user/:id', element: <UpdateUserForm /> },
            { path: 'privacy-policy', element: <PrivacyPolicy /> },
            { path: 'terms-of-service', element: <TermsOfService /> },
        ]
    }
])