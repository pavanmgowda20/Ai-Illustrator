import "./globals.css";

export const metadata = {
  title: "Personnel Illustrations Generator",
  description: "Generate minimalist, hand-drawn visual metaphors for your articles, blogs, and posts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
