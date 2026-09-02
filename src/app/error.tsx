"use client";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="simple-state">
      <div>
        <p>Trumpa pauzė</p>
        <h1>Kažkas nepavyko</h1>
        <span>Atnaujinkime šią testo dalį ir pabandykime dar kartą.</span>
        <button className="button button--primary" type="button" onClick={retry}>
          Bandyti dar kartą
        </button>
      </div>
    </main>
  );
}
