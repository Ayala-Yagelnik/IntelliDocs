import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router';
import { Box, Tab } from '@mui/material';
import LoginForm from './LoginForm';

const Nav = () => {

    return (
        <>
            <AppBar color='inherit' position="sticky" >
                <Toolbar style={{ justifyContent: 'flex-end' }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
                       <Button sx={{ my: 2, color: '#e91e63', display: 'block' }} >Sign up</Button>
                        <Button sx={{ my: 2, color: '#e91e63', display: 'block' }} >Sign in</Button>
                       
                    </Box>
                    <Tab component={Link} to="/" label="Home" />
                </Toolbar>
            </AppBar>
            <LoginForm></LoginForm>
        </>
    );
}
export default Nav;