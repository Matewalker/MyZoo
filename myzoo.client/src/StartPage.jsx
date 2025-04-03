import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from '@mui/material';

function StartPage() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Typography variant="h1">Play with MyZoo!</Typography>
            <Box sx={{
                display: 'grid',
                gap: 2,
                justifyItems: 'center',
            }}>
                <Button onClick={() => navigate("/register")} size="md" variant="solid" color="primary">
                    Registration
                </Button>
                <Button onClick={() => navigate("/login")} size="md" variant="solid" color="primary">
                    Login
                </Button>
            </Box>
        </Box>
    );
}

export default StartPage;