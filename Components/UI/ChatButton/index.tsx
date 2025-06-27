'use client';

import { Box, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatIcon from "@/assets/Images/chatIcon.png";
const FloatingChatButton = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: "20%",
        right: 24,
        zIndex: 1000,
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
        // borderRadius: '50%',
        background: 'linear-gradient(to bottom right, #00A1FF, #444CE7)',
        p: 1.2,
        borderEndEndRadius:0,
        borderTopRightRadius:'50%',
        borderTopLeftRadius:'50%',
        borderEndStartRadius:'50%'

      }}
    >
      <IconButton sx={{ color: '#fff' }}>
        {/* <ChatBubbleOutlineIcon /> */}
      <img src={ChatIcon.src} alt="no data"  style={{width:"35px" , height:"30px"}}/>

      </IconButton>
    </Box>
  );
};

export default FloatingChatButton;
 