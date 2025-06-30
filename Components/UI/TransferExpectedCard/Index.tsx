import React from "react";
import { Box, Typography, Button, Card, useTheme } from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DoneIcon from "@mui/icons-material/Done";

export default function TransferExpectedCard({ isTrue, type  }: { isTrue?: boolean, type: string  }) {
    const theme = useTheme();


    return (
        <Box
            //   minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f6f8fc"
            px={2}
            minHeight={'calc(100vh - 340px)'}
        >
            <Card
                sx={{
                    width: 400,
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
                    overflow: "hidden",
                    textAlign: "center",
                }}
            >
                {/* Top with radial gradient and icon */}


                {
                    type === 'crypto' ? (
                        <Box
                            sx={{
                                py: 3,
                                background:
                                    "radial-gradient(circle at top center, #e8f9f1, #ffffff 70%)"
                                ,
                            }}
                        >
                            <DoneIcon
                                sx={{
                                    fontSize: 48,
                                    color: "#12B76A",
                                }}
                            />

                        </Box>
                    ) : (
                        <Box
                            sx={{
                                py: 3,
                                background: isTrue
                                    ? "radial-gradient(circle at top center, #e8f9f1, #ffffff 70%)"
                                    : "radial-gradient(circle at top center, #fff7e0, #ffffff 70%)",
                            }}
                        >
                            {/* 12B76A45 */}

                            {isTrue ? (
                                <DoneIcon
                                    sx={{
                                        fontSize: 48,
                                        color: "#12B76A",
                                    }}
                                />
                            ) : (
                                <AccessTimeOutlinedIcon
                                    sx={{
                                        fontSize: 48,
                                        color: "#f5a623",
                                    }}
                                />
                            )}
                        </Box>
                    )
                }



                {/* Content */}
                <Box px={4} pb={4}>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        color="text.primary"
                        mb={1}
                        fontFamily="Space Grotesk"
                    >
                        {type === 'crypto'
                            ? 'Crypto Received'
                            : isTrue
                                ? 'Funds Received'
                                : 'Transfer Expected'}
                    </Typography>



                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={3}
                        fontFamily="Space Grotesk"
                    >

                        {
                            type === 'crypto' ? (
                                "Your payment has been confirmed."
                            ) : (
                                isTrue
                                    ? "Your payment has been confirmed."
                                    : "If you've completed the transfer, no further action is needed. We'll confirm your payment as soon as it arrives."
                            )
                        }



                    </Typography>

                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                            borderColor: "#4F46E5",
                            color: "#4F46E5",
                            textTransform: "none",
                            borderRadius: 30,
                            paddingTop: 2,
                            paddingBottom: 2,
                            "&:hover": {
                                backgroundColor: "#EEF2FF",
                                borderColor: "#4F46E5",
                            },
                        }}
                        endIcon={<span style={{ fontSize: "1.2rem" }}>→</span>}
                    >
                        Go to Website
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
