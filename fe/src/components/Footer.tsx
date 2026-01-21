import { Box, Container, Typography, Stack, IconButton } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => (
    <Box
        component="footer"
        sx={{ 
            py: 6, 
            mt: "auto", 
            bgcolor: "background.paper", 
            borderTop: "1px solid", 
            borderColor: "divider" 
        }}
    >
        <Container maxWidth="lg">
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        AsyncSchedule
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ⓒ 2026 AsyncSchedule Team. All rights reserved.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <IconButton aria-label="github" color="inherit">
                        <GitHubIcon />
                    </IconButton>
                    <IconButton aria-label="email" color="inherit">
                        <EmailIcon />
                    </IconButton>
                </Stack>
            </Stack>
        </Container>
    </Box>
);

export default Footer;