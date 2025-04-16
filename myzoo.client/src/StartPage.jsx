import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

function StartPage() {
    const navigate = useNavigate();

    return ( 
        <Box sx={{ height: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", display: "flex" }}>
            <Typography variant="h1" align="center" sx={{ color: "white", textShadow: "2px 2px 6px rgba(0,0,0,0.7)", marginBottom: 4 }}>
                Play with MyZoo!
            </Typography>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, justifyContent: "center", alignItems: "center", }}>
                <Button onClick={() => navigate("/register")} variant="contained"
                    sx={{ width: 200, backgroundColor: "mediumseagreen", color: "white", fontSize: "1.2rem", '&:hover': { backgroundColor: "#2e8b57" } }}>
                    Registration
                </Button>
                <Button onClick={() => navigate("/login")} variant="contained"
                    sx={{ width: 200, backgroundColor: "mediumseagreen", color: "white", fontSize: "1.2rem", '&:hover': { backgroundColor: "#2e8b57" } }}>
                    Login
                </Button>
            </Box>
        </Box>
    );
}

export default StartPage;