import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPS情報や回転情報をマルっと削除！ Tagless.",
  description: "写真をそのままWebに投稿すると、知らないうちに位置情報や撮影データが残っていることがあります。Tagless. なら、GPS情報や回転情報をまとめて削除して、安全な画像にしてから共有できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
