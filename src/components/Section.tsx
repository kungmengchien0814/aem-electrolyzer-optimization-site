import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  tone?: "default" | "muted";
};

export function Section({ id, eyebrow, title, lead, children, tone = "default" }: SectionProps) {
  return (
    <section id={id} className={`section ${tone === "muted" ? "section-muted" : ""}`}>
      <div className="section-inner">
        <div className="section-heading">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {lead && <p>{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
