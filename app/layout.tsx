import "./globals.css";
import { Toaster } from "react-hot-toast";
import "@fontsource/inter";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f0f11] text-white antialiased">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
