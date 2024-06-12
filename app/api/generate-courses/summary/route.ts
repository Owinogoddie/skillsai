import db from "@/lib/db";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getQuestionsFromTranscript, getTranscript } from "@/lib/youtube";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = body;

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "Chapter not found" },
        { status: 404 }
      );
    }

    if (!chapter.videoId) {
      return new NextResponse("Video not supported", { status: 500 });
    }

    let transcript = await getTranscript(chapter.videoId);
    if (!transcript) {
      return new NextResponse("Video not supported", { status: 500 });
    }

    if (transcript.length > 1000) {
      transcript = transcript.split(" ").slice(0, 1000).join(" ");
    }
    const summaryPrompt = `
      You are a helpful AI capable of summarizing a YouTube transcript.
      Summarize the transcript in 250 words or less, focusing only on the main topic.
      Exclude any mentions of sponsors or unrelated content.
      Do not introduce what the summary is about.

      The output should be a summary in the following format:
      {
        "summary": "string"
      }
    `;

    const inputText = `Summarize the following transcript: "${transcript}"`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: summaryPrompt },
        { role: "user", content: inputText },
      ],
      model: "llama3-70b-8192",
    });

    const resp = response.choices[0]?.message?.content;

    if (!resp) {
      throw new Error("Received empty response from Groq API");
    }

    let summary;
    try {
      summary = JSON.parse(resp);
    } catch (jsonError) {
      console.error("Failed to parse JSON response from Groq API:", jsonError);
      console.error("Groq API response:", resp);
      throw jsonError;
    }

    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.title
    );

    if (!questions) {
      throw new Error("Failed to generate questions");
    }

    await db.question.createMany({
      data: questions.map((question: any) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        // Shuffle options
        options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await db.chapter.update({
      where: { id: chapterId },
      data: {
        isFree: true,
        summary: summary.summary,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid body" },
        { status: 400 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { success: false, error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
