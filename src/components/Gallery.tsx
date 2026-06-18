import { useState } from "react";
import { comsolGallery } from "../data/results";

export function Gallery() {
  const [active, setActive] = useState<(typeof comsolGallery)[number] | null>(null);

  return (
    <>
      <div className="gallery-grid">
        {comsolGallery.map((item) => (
          <button className="gallery-card" key={item.src} type="button" onClick={() => setActive(item)}>
            <img src={item.src} alt={item.title} loading="lazy" />
            <span>{item.title}</span>
            <small>{item.caption}</small>
          </button>
        ))}
      </div>
      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <button className="lightbox-close" type="button" aria-label="關閉圖片">
            x
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={active.src} alt={active.title} />
            <figcaption>
              <strong>{active.title}</strong>
              <span>{active.caption}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
