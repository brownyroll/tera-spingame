import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Navbar from "@/components/Navbar";
import SnowEffect from "@/components/SnowEffect";

import { Box } from "@mui/material";

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terabyteplus Random",
  description: "ระบบนี้จัดทำโดย Brownyrollz Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <ThemeRegistry>
          <SnowEffect />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <Box
              component="main"
              sx={{ flexGrow: 1, backgroundColor: "background.default" }}
            >
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
