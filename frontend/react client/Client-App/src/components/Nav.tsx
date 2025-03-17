import { AppBar, Toolbar, Button, Box, Tab, Typography} from '@mui/material';
import { Link } from 'react-router-dom';


// צבעים וקונפיגורציות
const primaryColor = "#10a37f";
const textColor = "#333";


// ניווט ראשי
export const Nav = () => (
    <AppBar color='inherit' position="sticky" sx={{ boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h6" fontWeight={600} color={textColor}>IntelliDocs</Typography>
            </Box>
            <Box>
                <Button component={Link} to="/register" sx={{ color: primaryColor }}>Sign up</Button>
                <Button component={Link} to="/login" sx={{ color: primaryColor }}>Sign in</Button>
            </Box>
            <Tab component={Link} to="/" label="Home" />
        </Toolbar>
    </AppBar>
);
export default Nav;