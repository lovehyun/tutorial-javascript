// app/layout.tsx
export const metadata = {
  title: "간단 TODO 앱",
  description: "Next.js TODO with API example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f3f4f6",
        }}
      >
        {children}
      </body>
    </html>
  );
}
