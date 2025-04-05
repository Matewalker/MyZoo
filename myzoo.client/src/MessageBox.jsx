import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Collapse, ListItemIcon, Box } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, Mail } from '@mui/icons-material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

function MessageBox({ messages }) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Box>
            <List>
                <ListItem>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <Mail /> {/* Boríték ikon */}
                        </ListItemIcon>
                        <ListItemText primary="Messages" />
                        {open ? <ExpandMore /> : <ExpandLess />} {/* Kép ikon a lenyitás/becsukás állapotának kezeléséhez */}
                    </ListItemButton>
                </ListItem>
            </List>

            {/* Lenyitható tartalom */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {messages.map((message, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={message.text} />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </Box>
    );
}

export default MessageBox;