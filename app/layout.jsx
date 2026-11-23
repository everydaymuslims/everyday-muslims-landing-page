import "./globals.css";

const description =
  "Something we’ve been dreaming up is finally taking shape. Join the Everyday Muslims launch list for the first look.";

export const metadata = {
  title: "Everyday Muslims | Coming Soon",
  description,
  openGraph: {
    title: "Everyday Muslims | Coming Soon",
    description,
    siteName: "Everyday Muslims",
    type: "website",
  },
  icons: { icon: "/identity/favicon.png" },
};

export const viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }) {
  return (
    <html className="m-enter" lang="en" data-type="product">
      <head>
        <meta name="page-type" content="product" />
        <meta name="site-kind" content="other" />
        <noscript><style>{".mark-drawing:not([data-trace]) { animation: none; }"}</style></noscript>
      </head>
      <body id="top" className="landing">{children}</body>
    </html>
  );
}
