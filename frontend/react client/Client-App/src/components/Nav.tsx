import { AppBar, Toolbar, Button, Box, Tab, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { StoreType } from '../models/storeModel';
import { logout } from '../store/authSlice';


// צבעים וקונפיגורציות
const primaryColor = "#10a37f";
const textColor = "#333";


// ניווט ראשי
const Nav: React.FC = () => {
    const user = useSelector((state: StoreType) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout=()=>{
        dispatch(logout());
    }
    return (
        <AppBar color='inherit' position="sticky" sx={{ boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h6" fontWeight={600} color={textColor}>IntelliDocs</Typography>
                </Box>
                <Box>
                    {!user && (
                        <>
                            <Button component={Link} to="/register" sx={{ color: primaryColor }}>Sign up</Button>
                            <Button component={Link} to="/login" sx={{ color: primaryColor }}>Sign in</Button>
                        </>
                    )}
                    {user && (
                        <>
                            <Button component={Link} to="/files" sx={{ color: primaryColor }}>My Files</Button> 
                            <Button component={Link} to="/files" sx={{ color: primaryColor }}>Files Shared With Me</Button> 
                            <Button component={Link} to="/" onClick={handleLogout} sx={{ color: primaryColor }}>log out</Button>
                        </>
                    )}
                </Box>
                <Tab component={Link} to="/" label="Home" />
            </Toolbar>
        </AppBar>
    )
}
export default Nav;