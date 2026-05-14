import { useEffect, useRef } from "react";

const useScrollReveal = (threshold = 150) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");

            // Handle staggered animation for gallery items
            if (entry.target.classList.contains("gallery-section")) {
              const items = entry.target.querySelectorAll(".gallery-item");
              items.forEach((item, index) => {
                (item as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
              });
            }
          }
        });
      },
      { rootMargin: `0px 0px -${threshold}px 0px` },
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return ref;
};

export default useScrollReveal;
