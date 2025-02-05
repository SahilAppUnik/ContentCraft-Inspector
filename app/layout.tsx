import type { ReactNode } from "react";
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>ContentCraft-Inspector</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
