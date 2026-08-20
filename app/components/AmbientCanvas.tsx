"use client";

import { useEffect, useRef } from "react";

type AmbientLayer = "back" | "front";

export function AmbientCanvas({
  color = 0xffdc6a,
  layer = "back",
}: {
  color?: number;
  layer?: AmbientLayer;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const { Application, Graphics } = await import("pixi.js");
      if (disposed) return;

      const app = new Application();
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });

      if (disposed) {
        app.destroy(true, { children: true });
        return;
      }

      host.appendChild(app.canvas);

      const width = () => Math.max(host.clientWidth, 600);
      const height = () => Math.max(host.clientHeight, 420);

      if (layer === "back") {
        const motes = Array.from({ length: 32 }, (_, index) => {
          const radius = 1.5 + (index % 5) * 0.72;
          const mote = new Graphics()
            .circle(0, 0, radius)
            .fill({ color, alpha: 0.18 + (index % 5) * 0.065 });
          mote.x = Math.random() * width();
          mote.y = Math.random() * height();
          mote.scale.set(0.65 + Math.random() * 1.1);
          app.stage.addChild(mote);
          return {
            view: mote,
            speed: 0.09 + Math.random() * 0.28,
            sway: 0.16 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
          };
        });

        let time = 0;
        const animate = () => {
          time += 0.018;
          for (const mote of motes) {
            mote.view.y -= mote.speed;
            mote.view.x += Math.sin(time + mote.phase) * mote.sway;
            mote.view.alpha = 0.28 + Math.sin(time * 1.9 + mote.phase) * 0.2;
            mote.view.scale.x = 0.72 + Math.sin(time * 2.3 + mote.phase) * 0.18;
            if (mote.view.y < -14) {
              mote.view.y = height() + 14;
              mote.view.x = Math.random() * width();
            }
          }
        };
        app.ticker.add(animate);
        cleanup = () => {
          app.ticker.remove(animate);
          app.destroy(true, { children: true });
        };
      } else {
        const leaves = Array.from({ length: 11 }, (_, index) => {
          const leaf = new Graphics()
            .ellipse(0, 0, 5 + (index % 3) * 2, 11 + (index % 4) * 2)
            .fill({ color: index % 2 ? 0x2f7140 : 0x8ba94e, alpha: 0.3 + (index % 4) * 0.08 });
          leaf.x = Math.random() * width();
          leaf.y = Math.random() * height();
          leaf.rotation = Math.random() * Math.PI;
          leaf.scale.set(0.7 + Math.random() * 0.9);
          app.stage.addChild(leaf);
          return {
            view: leaf,
            fall: 0.34 + Math.random() * 0.72,
            drift: 0.26 + Math.random() * 0.58,
            spin: (Math.random() - 0.5) * 0.018,
            phase: Math.random() * Math.PI * 2,
          };
        });

        let time = 0;
        const animate = () => {
          time += 0.016;
          for (const leaf of leaves) {
            leaf.view.y += leaf.fall;
            leaf.view.x += Math.sin(time + leaf.phase) * leaf.drift;
            leaf.view.rotation += leaf.spin;
            if (leaf.view.y > height() + 25) {
              leaf.view.y = -25;
              leaf.view.x = Math.random() * width();
            }
          }
        };
        app.ticker.add(animate);
        cleanup = () => {
          app.ticker.remove(animate);
          app.destroy(true, { children: true });
        };
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [color, layer]);

  return <div ref={hostRef} className={`ambient-canvas ambient-canvas--${layer}`} aria-hidden="true" />;
}
