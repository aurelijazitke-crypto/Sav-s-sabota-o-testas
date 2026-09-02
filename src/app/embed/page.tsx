import { QuizShell } from "@/components/quiz/quiz-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "„Geros mergaitės“ testas",
  robots: { index: false, follow: false }
};

export default function EmbedPage() {
  return (
    <QuizShell
      embedded
      emailEnabled={Boolean(
        (process.env.MAILERLITE_API_TOKEN ||
          process.env.MAILERLITE_API_KEY) &&
          process.env.MAILERLITE_GROUP_ID
      )}
      programUrl={
        process.env.NEXT_PUBLIC_PROGRAM_URL || "https://aurelijazitke.lt"
      }
    />
  );
}
