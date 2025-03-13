import { Outlet } from "react-router"
import Nav from "./Nav"


const AppLayout = () => {

    return (<>


            <Nav />
            <Outlet />


    </>)
}

export default AppLayout