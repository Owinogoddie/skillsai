import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { QueryProvider } from "@/components/providers/query-client-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import ytdl from "ytdl-core";

import youtube from "youtube-search-scraper";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart lerning app",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const session = await auth();
    // console.log(session?.user)
    // const yt = new youtube.Scraper()
    // const results = await yt.search("Javascript");

    // if (!results || !results.videos || results.videos.length === 0) {
    //   console.log("youtube-search-scraper returned no results");
    //   return null;
    // }

    // const videoId = results.videos[0].id;
    // console.log(videoId)
    // const info = await ytdl.getInfo('W6NZfCO5SIk');
    // const { videoDetails } = info;
    // console.log(info)
    // return {
    //   title: videoDetails.title,
    //   description: videoDetails.description,
    //   author: videoDetails.author.name,
    //   relatedPlaylists: videoDetails.related_playlists
    // };
  } catch (error) {
    console.error("Error fetching video info:", error);
    return null;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <TooltipProvider>
            <ToastProvider />
            <ConfettiProvider />
            <QueryProvider>{children}</QueryProvider>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
