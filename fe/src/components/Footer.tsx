import { Box, Typography } from "@mui/material";

const Footer = () => (
    <Box
        component="footer"
        sx={{ textAlign: "center", py: 2, mt: 8, borderTop: "1px solid #ddd" }}
    >
        <Typography variant="body2" color="text.secondary">
            ⓒ 2025 My App. All rights reserved.
        </Typography>
    </Box>
);

export default Footer;
