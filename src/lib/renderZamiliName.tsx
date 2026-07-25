import { Fragment, type ReactNode } from "react";

/**
 * Splits copy on the literal "Zamili" and wraps each occurrence in the
 * `.zamili-name` Latin-font span, so the brand name keeps its Latin type
 * treatment even mid-sentence in Arabic copy (IDENTITY.md §1).
 */
export function renderWithZamiliName(text: string): ReactNode {
  const parts = text.split(/(Zamili)/g);
  return parts.map((part, i) =>
    part === "Zamili" ? (
      <span key={i} className="zamili-name">
        Zamili
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
