import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, GlobalStyles } from "@mui/material";

function StartPage() {
    const navigate = useNavigate();

    return (
        <>
            <GlobalStyles styles={{
                html: { margin: 0, padding: 0, height: "100%" },
                body: { margin: 0, padding: 0, height: "100%" },
                "#root": { height: "100%" }
            }} />

            <Box sx={{
                minHeight: "100vh", width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: "url('startBg.jpg')",
                backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", display: "flex"
            }}>
                <Typography variant="h2" align="center" sx={{ color: "white", textShadow: "2px 2px 6px rgba(0,0,0,0.7)", marginBottom: 4 }}>
                    Play with MyZoo!
                </Typography>

                <Box
                    sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, justifyContent: "center", alignItems: "center", }}>
                    <Button
                        onClick={() => navigate("/register")} variant="contained"
                        sx={{ width: 200, backgroundColor: "mediumseagreen", color: "white", fontSize: "1.2rem", '&:hover': { backgroundColor: "#2e8b57" } }}>
                        Registration
                    </Button>
                    <Button
                        onClick={() => navigate("/login")} variant="contained"
                        sx={{ width: 200, backgroundColor: "mediumseagreen", color: "white", fontSize: "1.2rem", '&:hover': { backgroundColor: "#2e8b57" } }}>
                        Login
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default StartPage;