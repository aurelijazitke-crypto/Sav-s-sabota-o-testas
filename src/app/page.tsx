import { QuizShell } from "@/components/quiz/quiz-shell";

export default function HomePage() {
  return (
    <QuizShell
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
