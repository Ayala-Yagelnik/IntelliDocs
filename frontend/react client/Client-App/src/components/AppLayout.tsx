import { Outlet } from "react-router"
import Nav from "./Nav"
import { Box } from "@mui/material"


const AppLayout = () => {

    return (
        <>
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Nav />
                <Outlet />
            </Box>
        </>
    )
}

export default AppLayout