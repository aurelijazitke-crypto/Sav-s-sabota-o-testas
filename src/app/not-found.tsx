import { ArrowLeftIcon } from "@/components/icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="simple-state">
      <div>
        <p>404</p>
        <h1>Šio puslapio nėra</h1>
        <span>Galbūt nuoroda pasikeitė arba joje įsivėlė klaida.</span>
        <Link className="button button--primary" href="/">
          <ArrowLeftIcon />
          Grįžti į testą
        </Link>
      </div>
    </main>
  );
}
