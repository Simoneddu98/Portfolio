"use client";

import { cn } from "@/lib/utils";

interface ImageSource {
  src: string;
  alt: string;
}

interface RevealImageListItemProps {
  text: string;
  href: string;
  images: [ImageSource, ImageSource];
}

function RevealImageListItem({ text, href, images }: RevealImageListItemProps) {
  const container = "absolute right-8 -top-1 z-40 h-20 w-16";
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover:shadow-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:h-full w-16 h-16 overflow-hidden transition-all rounded-md";

  return (
    <a
      href={href}
      className="group relative h-fit w-fit overflow-visible py-8 block"
    >
      <h2
        className="font-black leading-none transition-all duration-500 group-hover:opacity-40"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem, 7vw, 7rem)",
          color: "var(--color-ink)",
          letterSpacing: "-0.04em",
        }}
      >
        {text}
      </h2>
      <div className={container}>
        <div className={effect}>
          <img alt={images[1].alt} src={images[1].src} className="h-full w-full object-cover" />
        </div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12",
        )}
      >
        <div className={cn(effect, "duration-200")}>
          <img alt={images[0].alt} src={images[0].src} className="h-full w-full object-cover" />
        </div>
      </div>
    </a>
  );
}

const items: RevealImageListItemProps[] = [
  {
    text: "Il Metodo",
    href: "#metodo",
    images: [
      {
        src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&auto=format&fit=crop&q=60",
        alt: "Metodo di lavoro",
      },
      {
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&auto=format&fit=crop&q=60",
        alt: "Strategia",
      },
    ],
  },
  {
    text: "Servizi",
    href: "#servizi",
    images: [
      {
        src: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&auto=format&fit=crop&q=60",
        alt: "Formazione AI",
      },
      {
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=60",
        alt: "Consulenza",
      },
    ],
  },
  {
    text: "Lavori",
    href: "#works",
    images: [
      {
        src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&auto=format&fit=crop&q=60",
        alt: "Portfolio lavori",
      },
      {
        src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200&auto=format&fit=crop&q=60",
        alt: "Progetti",
      },
    ],
  },
  {
    text: "Contatti",
    href: "#contatti",
    images: [
      {
        src: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=200&auto=format&fit=crop&q=60",
        alt: "Contattami",
      },
      {
        src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&auto=format&fit=crop&q=60",
        alt: "Collaboriamo",
      },
    ],
  },
];

export function RevealImageList() {
  return (
    <div className="flex flex-col gap-1 px-[var(--page-px)] py-16 bg-background">
      <p
        className="text-sm font-black uppercase mb-4"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-ink-muted, hsl(var(--muted-foreground)))",
          letterSpacing: "0.08em",
        }}
      >
        Esplora
      </p>
      {items.map((item, index) => (
        <RevealImageListItem key={index} {...item} />
      ))}
    </div>
  );
}
