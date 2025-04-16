import React from "react";
import { List, ListItem, ListItemText, ListItemIcon, Box } from "@mui/material";
import { Mail } from "@mui/icons-material";

function MessageBox({ messages, sx ={} }) {
    return (
        <Box sx={{ width: "34%", maxHeight: "300px", overflowY: "auto", backgroundColor: "mediumseagreen", padding: "10px", 
            borderRadius: "8px", ...sx }}>
            <List>
                <ListItem disablePadding>
                    <ListItemIcon>
                        <Mail sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Messages" sx={{ color: "white" }} />
                </ListItem>

                <Box sx={{ maxHeight: "100px", overflowY: "auto", marginTop: "10px" }}>
                    <List>
                        {messages.map((message, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={message} sx={{ color: "white" }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </List>
        </Box>
    );
}

export default MessageBox;