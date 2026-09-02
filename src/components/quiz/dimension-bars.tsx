import { DIMENSIONS } from "@/lib/quiz-content";
import type { DimensionResult } from "@/lib/quiz-types";

export function DimensionBars({
  dimensions,
  broad = false
}: {
  dimensions: DimensionResult[];
  broad?: boolean;
}) {
  const rankedDimensions = [...dimensions].sort(
    (a, b) => b.score - a.score
  );
  const first = rankedDimensions[0];
  const hasVisiblePattern = first.score > 0;
  const highlightedDimensions = hasVisiblePattern
    ? rankedDimensions.filter((dimension, index) => {
        if (first.score === dimension.score) return true;
        if (!broad) return false;
        return first.score - dimension.score <= 8 || index < 2;
      })
    : [];
  const highlightedLabels = highlightedDimensions.map((dimension) =>
    DIMENSIONS[dimension.id].label.toLowerCase()
  );
  const highlightedText = highlightedLabels.length <= 1
    ? highlightedLabels[0]
    : highlightedLabels.slice(0, -1).join(", ") +
      " ir " +
      highlightedLabels.at(-1);
  const showSeveral = highlightedDimensions.length > 1;

  return (
    <section className="result-section" aria-labelledby="dimensions-title">
      <div className="section-heading">
        <span>Penkios kryptys</span>
        <h2 id="dimensions-title">Kur šios reakcijos išryškėja labiausiai?</h2>
        <p>
          Tai nėra diagnozė ar tavo vertės įvertinimas. Juostos tik palygina
          tavo atsakymus skirtingose kasdienio prisitaikymo srityse.
        </p>
      </div>

      <div className="dimension-list">
        {dimensions.map((dimension) => (
          <div className="dimension" key={dimension.id}>
            <div className="dimension__heading">
              <span>{dimension.shortLabel}</span>
              <small>{dimension.frequency}</small>
            </div>
            <div className="dimension__track" aria-hidden="true">
              <span style={{ width: dimension.score + "%" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="result-observation">
        <span className="result-observation__dot" aria-hidden="true" />
        {hasVisiblePattern ? (
          <p>
            {showSeveral ? "Ryškiausios kryptys: " : "Ryškiausia kryptis: "}
            <strong>{highlightedText}</strong>. Stebėk {showSeveral ? "jas" : "ją"} ne tam, kad save taisytum, o
            kad anksčiau išgirstum save.
          </p>
        ) : (
          <p>
            Šiame atsakymų rinkinyje nė viena kryptis neišryškėjo. Priimk tai
            kaip dabartinės patirties momentinę nuotrauką, o ne galutinę išvadą.
          </p>
        )}
      </div>
    </section>
  );
}
