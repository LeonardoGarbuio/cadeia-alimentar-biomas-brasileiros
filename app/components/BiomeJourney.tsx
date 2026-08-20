"use client";

import { useEffect, useRef, useState } from "react";
import { AmbientCanvas } from "./AmbientCanvas";
import { biomes, type Biome, type Species } from "../data/biomes";

type Screen = "map" | "mission" | "success";
type Feedback = "idle" | "hint" | "wrong" | "correct" | "repeat";

const progressKey = "biomas-brasileiros-progresso-v2";
const legacyProgressKey = "biomas-brasileiros-progresso-v1";

const chainKey = (chain: string[]) => chain.join(">");

function masteryStars(found: number, total: number) {
  if (found === 0) return 0;
  if (found >= total) return 3;
  return found >= 2 ? 2 : 1;
}

function Stars({ count, compact = false }: { count: number; compact?: boolean }) {
  return (
    <span className={compact ? "stars stars--compact" : "stars"} aria-label={`${count} de 3 estrelas`}>
      {[0, 1, 2].map((star) => (
        <span key={star} className={star < count ? "star star--won" : "star"}>★</span>
      ))}
    </span>
  );
}

function SpeciesArtwork({ species }: { species: Species }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (species.image && !imageFailed) {
    return <img src={species.image} alt="" onError={() => setImageFailed(true)} />;
  }
  return <span aria-hidden="true">{species.emoji}</span>;
}

function ForestActors({
  species,
  answer,
  onChoose,
}: {
  species: Species[];
  answer: string[];
  onChoose?: (species: Species) => void;
}) {
  return (
    <div className="forest-actors forest-actors--six" aria-label="Seis seres vivos no cenário">
      {species.map((item, index) => {
        const selection = answer.indexOf(item.id);
        const selected = selection >= 0;
        return (
          <button
            key={item.id}
            type="button"
            className={`forest-actor forest-actor--slot-${index} forest-actor--${item.id} ${selected ? "forest-actor--selected" : ""}`}
            data-actor={item.id}
            onClick={() => onChoose?.(item)}
            disabled={!onChoose || selected}
            aria-label={selected ? `${item.name}, posição ${selection + 1}` : `Selecionar ${item.name}`}
          >
            <span className="forest-actor__glow" aria-hidden="true" />
            <span className="forest-actor__habitat forest-actor__habitat--back" aria-hidden="true" />
            <span className="forest-actor__art"><SpeciesArtwork species={item} /></span>
            <span className="forest-actor__habitat forest-actor__habitat--front" aria-hidden="true" />
            <span className="forest-actor__name">{item.name}</span>
            {selected ? (
              <span className="forest-actor__order" aria-hidden="true">{selection + 1}</span>
            ) : (
              <span className="forest-actor__tap" aria-hidden="true">+</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SceneDecor({ biomeId }: { biomeId: string }) {
  const isAmazon = biomeId === "amazonia";
  return (
    <>
      <div className="sun-rays" aria-hidden="true" />
      <div className="mist mist--one" aria-hidden="true" />
      <div className="mist mist--two" aria-hidden="true" />
      <div className="water-shimmer" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="forest-birds" aria-hidden="true"><i /><i /><i /></div>
      <div className="butterflies" aria-hidden="true"><i /><i /><i /></div>
      {isAmazon && (
        <>
          <div className="world-producers" aria-hidden="true">
            <img
              className="world-producer world-producer--castanheira"
              src="/species/game-castanheira-v2.png"
              alt=""
              draggable={false}
            />
            <img
              className="world-producer world-producer--embauba"
              src="/species/catalog-embauba-v1.png"
              alt=""
              draggable={false}
            />
          </div>
          <div className="world-canopy-layer" aria-hidden="true">
            <img src="/scene/amazon-canopy-foreground-v1.png" alt="" draggable={false} />
            <img src="/scene/amazon-canopy-foreground-v1.png" alt="" draggable={false} />
          </div>
          <img className="world-occlusion world-occlusion--cutia" src="/scene/amazon-ground-cutia-v1.png" alt="" draggable={false} />
          <img className="world-sloth-tree" src="/scene/amazon-sloth-tree-integrated-v1.png" alt="" draggable={false} />
          <img className="world-occlusion world-occlusion--onca" src="/scene/amazon-foreground-right-v1.png" alt="" draggable={false} />
        </>
      )}
      <div className="foreground-leaves foreground-leaves--left" aria-hidden="true"><i /><i /><i /></div>
      <div className="foreground-leaves foreground-leaves--right" aria-hidden="true"><i /><i /><i /></div>
      <div className="forest-floor" aria-hidden="true" />
    </>
  );
}

export default function BiomeJourney() {
  const [screen, setScreen] = useState<Screen>("map");
  const [selectedBiome, setSelectedBiome] = useState<Biome>(biomes[0]);
  const [unlocked, setUnlocked] = useState(1);
  const [completed, setCompleted] = useState<Record<string, number>>({});
  const [discoveries, setDiscoveries] = useState<Record<string, string[]>>({});
  const [answer, setAnswer] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [sceneTap, setSceneTap] = useState<{ x: number; y: number; key: number } | null>(null);
  const [panEdges, setPanEdges] = useState({ start: true, end: false });
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, pointerId: -1, startX: 0, startScroll: 0, moved: false });

  const biomeDiscoveries = discoveries[selectedBiome.id] ?? [];
  const allChainsFound = biomeDiscoveries.length >= selectedBiome.chains.length;
  const exploredBiomes = Object.values(completed).filter((stars) => stars > 0).length;

  useEffect(() => {
    let frame = 0;
    try {
      const readProgress = (key: string) => {
        const saved = window.localStorage.getItem(key);
        if (!saved) return {};
        return JSON.parse(saved) as {
          unlocked?: number;
          completed?: Record<string, number>;
          discoveries?: Record<string, string[]>;
        };
      };
      const progress = readProgress(progressKey);
      const legacy = readProgress(legacyProgressKey);
      if (!progress.unlocked && !legacy.unlocked) return;
      const mergedCompleted = Object.fromEntries(
        biomes.map((biome) => [
          biome.id,
          Math.max(progress.completed?.[biome.id] ?? 0, legacy.completed?.[biome.id] ?? 0),
        ]),
      );
      const mergedProgress = {
        unlocked: Math.max(progress.unlocked ?? 1, legacy.unlocked ?? 1),
        completed: mergedCompleted,
        discoveries: progress.discoveries ?? {},
      } satisfies {
        unlocked?: number;
        completed?: Record<string, number>;
        discoveries?: Record<string, string[]>;
      };
      frame = window.requestAnimationFrame(() => {
        setUnlocked(Math.max(1, Math.min(mergedProgress.unlocked, biomes.length)));
        setCompleted(mergedProgress.completed);
        setDiscoveries(mergedProgress.discoveries);
      });
    } catch {
      // Invalid local data simply starts a fresh expedition.
    }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || screen === "map") return;
    const syncEdges = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      setPanEdges({ start: scroller.scrollLeft <= 8, end: scroller.scrollLeft >= max - 8 });
    };
    const frame = window.requestAnimationFrame(() => {
      scroller.scrollLeft = 0;
      syncEdges();
    });
    window.addEventListener("resize", syncEdges);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncEdges);
    };
  }, [screen, selectedBiome.id]);

  const openMission = (biome: Biome) => {
    if (biome.level > unlocked) return;
    setSelectedBiome(biome);
    setAnswer([]);
    setFeedback("idle");
    setScreen("mission");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseSpecies = (species: Species) => {
    if (answer.includes(species.id) || answer.length === 3) return;
    setAnswer((current) => [...current, species.id]);
    setFeedback("idle");
  };

  const removeSpecies = (id: string) => {
    setAnswer((current) => current.filter((item) => item !== id));
    setFeedback("idle");
  };

  const checkAnswer = () => {
    const submittedKey = chainKey(answer);
    const isValid = selectedBiome.chains.some((chain) => chainKey(chain) === submittedKey);
    if (!isValid) {
      setFeedback("wrong");
      return;
    }

    if (biomeDiscoveries.includes(submittedKey)) {
      setFeedback("repeat");
      return;
    }

    const nextBiomeDiscoveries = [...biomeDiscoveries, submittedKey];
    const nextDiscoveries = { ...discoveries, [selectedBiome.id]: nextBiomeDiscoveries };
    const nextUnlocked = Math.min(biomes.length, Math.max(unlocked, selectedBiome.level + 1));
    const nextCompleted = {
      ...completed,
      [selectedBiome.id]: Math.max(
        completed[selectedBiome.id] ?? 0,
        masteryStars(nextBiomeDiscoveries.length, selectedBiome.chains.length),
      ),
    };
    setUnlocked(nextUnlocked);
    setCompleted(nextCompleted);
    setDiscoveries(nextDiscoveries);
    setFeedback("correct");
    window.localStorage.setItem(progressKey, JSON.stringify({
      unlocked: nextUnlocked,
      completed: nextCompleted,
      discoveries: nextDiscoveries,
    }));
  };

  const continueMission = () => {
    if (allChainsFound) {
      setScreen("success");
      return;
    }
    setAnswer([]);
    setFeedback("idle");
  };

  const backToMap = () => {
    setScreen("map");
    setAnswer([]);
    setFeedback("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const moveWorld = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX / rect.width - 0.5;
    const y = event.clientY / rect.height - 0.5;
    event.currentTarget.style.setProperty("--far-x", `${x * -12}px`);
    event.currentTarget.style.setProperty("--far-y", `${y * -8}px`);
    event.currentTarget.style.setProperty("--mid-x", `${x * 9}px`);
    event.currentTarget.style.setProperty("--mid-y", `${y * 6}px`);
    event.currentTarget.style.setProperty("--near-x", `${x * 22}px`);
    event.currentTarget.style.setProperty("--near-y", `${y * 13}px`);
  };

  const restWorld = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--far-x", "0px");
    event.currentTarget.style.setProperty("--far-y", "0px");
    event.currentTarget.style.setProperty("--mid-x", "0px");
    event.currentTarget.style.setProperty("--mid-y", "0px");
    event.currentTarget.style.setProperty("--near-x", "0px");
    event.currentTarget.style.setProperty("--near-y", "0px");
  };

  const reactWorld = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }
    const stage = (event.currentTarget as HTMLElement).closest("[data-world-stage]") as HTMLElement | null;
    const rect = stage?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
    setSceneTap({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      key: Date.now(),
    });
  };

  const syncPanEdges = (scroller: HTMLDivElement) => {
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    setPanEdges({ start: scroller.scrollLeft <= 8, end: scroller.scrollLeft >= max - 8 });
  };

  const panScene = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.78, behavior: "smooth" });
  };

  const beginSceneDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: event.currentTarget.scrollLeft,
      moved: false,
    };
    event.currentTarget.classList.add("world-game__scroller--dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveSceneDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    const distance = event.clientX - dragRef.current.startX;
    if (Math.abs(distance) > 5) dragRef.current.moved = true;
    event.currentTarget.scrollLeft = dragRef.current.startScroll - distance;
  };

  const endSceneDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.active = false;
    event.currentTarget.classList.remove("world-game__scroller--dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const panorama = (actorsAnswer: string[], onChoose?: (species: Species) => void, success = false) => (
    <>
      <div
        className="world-game__scroller"
        ref={scrollerRef}
        onScroll={(event) => syncPanEdges(event.currentTarget)}
        onPointerDown={beginSceneDrag}
        onPointerMove={moveSceneDrag}
        onPointerUp={endSceneDrag}
        onPointerCancel={endSceneDrag}
      >
        <div className="world-game__stage" data-world-stage onClick={reactWorld}>
          <div className="world-game__backdrop" role="img" aria-label={`Paisagem ilustrada da ${selectedBiome.name}`}>
            <img src={selectedBiome.image} alt="" draggable={false} />
            <img src={selectedBiome.image} alt="" draggable={false} />
          </div>
          <div className="world-game__grade" />
          <SceneDecor biomeId={selectedBiome.id} />
          <AmbientCanvas color={success ? 0xffe590 : 0xffdc6a} />
          <AmbientCanvas color={success ? 0xffe590 : 0xffdc6a} layer="front" />
          {sceneTap && <span key={sceneTap.key} className="scene-touch" style={{ left: `${sceneTap.x}%`, top: `${sceneTap.y}%` }} aria-hidden="true"><i /><i /><i /></span>}
          <ForestActors species={selectedBiome.species} answer={actorsAnswer} onChoose={onChoose} />
        </div>
      </div>
      <nav className="scene-pan" aria-label="Navegar pelo cenário">
        <button type="button" className="scene-pan__button scene-pan__button--left" onClick={() => panScene(-1)} disabled={panEdges.start} aria-label="Explorar a parte anterior do cenário">←</button>
        <span className="scene-pan__hint">Arraste para explorar</span>
        <button type="button" className="scene-pan__button scene-pan__button--right" onClick={() => panScene(1)} disabled={panEdges.end} aria-label="Explorar a próxima parte do cenário">→</button>
      </nav>
    </>
  );

  if (screen === "map") {
    return (
      <main className="journey-shell">
        <header className="topbar">
          <a className="brand" href="#inicio" aria-label="Início">
            <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Cadeia Alimentar</span>
          </a>
          <span className="map-version">Uma aventura pelos biomas do Brasil</span>
        </header>

        <section id="inicio" className="hero-map">
          <AmbientCanvas />
          <div className="hero-map__copy">
            <span className="kicker"><span>Expedição</span> • Brasil</span>
            <h1>Cadeia alimentar dos<br /><em>biomas brasileiros</em></h1>
            <p>A floresta está viva. Encontre plantas e animais e descubra como a energia viaja entre eles.</p>
            <button type="button" className="hero-play" onClick={() => openMission(biomes[0])}>
              Começar aventura <span aria-hidden="true">▶</span>
            </button>
            <div className="progress-summary">
              <span className="progress-summary__number">{exploredBiomes}<small>/5</small></span>
              <span>biomas<br />explorados</span>
              <div className="progress-line"><i style={{ width: `${exploredBiomes * 20}%` }} /></div>
            </div>
          </div>
          <div className="hero-map__leaf hero-map__leaf--one" aria-hidden="true" />
          <div className="hero-map__leaf hero-map__leaf--two" aria-hidden="true" />
        </section>

        <section className="expedition" aria-labelledby="expedition-title">
          <div className="section-heading">
            <div><span className="section-number">01</span><p>Rota da expedição</p><h2 id="expedition-title">Escolha um bioma</h2></div>
            <p className="section-intro">Encontre várias cadeias na mesma partida. A primeira descoberta abre o próximo destino.</p>
          </div>
          <div className="biome-grid">
            {biomes.map((biome) => {
              const isLocked = biome.level > unlocked;
              const stars = completed[biome.id] ?? 0;
              return (
                <button
                  className={`biome-card ${isLocked ? "biome-card--locked" : ""}`}
                  key={biome.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => openMission(biome)}
                  style={{ "--accent": biome.accent, "--deep": biome.deep } as React.CSSProperties}
                  aria-label={isLocked ? `${biome.name}, nível ${biome.level}, bloqueado` : `Jogar ${biome.name}, nível ${biome.level}`}
                >
                  <img src={biome.image} alt="" />
                  <span className="biome-card__shade" />
                  <span className="biome-card__topline"><span>Nível {biome.level}</span>{isLocked ? <span className="lock" aria-hidden="true">●</span> : <Stars count={stars} compact />}</span>
                  <span className="biome-card__copy"><small>{biome.region}</small><strong>{biome.name}</strong><span>{biome.eyebrow}</span><b>6 seres • {biome.chains.length} cadeias</b></span>
                  <span className="biome-card__action" aria-hidden="true">{isLocked ? "Bloqueado" : stars ? "Jogar novamente ↗" : "Explorar ↗"}</span>
                </button>
              );
            })}
          </div>
        </section>
        <footer className="game-footer"><span>Uma jornada pelos ecossistemas do Brasil</span><span>Protótipo jogável • conteúdo em evolução</span></footer>
      </main>
    );
  }

  if (screen === "success") {
    const nextBiome = biomes[selectedBiome.level];
    return (
      <main className={`world-game world-game--success biome-${selectedBiome.id}`} style={{ "--accent": selectedBiome.accent, "--deep": selectedBiome.deep } as React.CSSProperties} onPointerMove={moveWorld} onPointerLeave={restWorld}>
        {panorama([], undefined, true)}
        <button type="button" className="game-back" onClick={backToMap} aria-label="Voltar ao mapa">← <span>Mapa</span></button>
        <div className="celebration-stars" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index}>✦</i>)}</div>
        <section className="victory-panel">
          <span className="victory-panel__eyebrow">{selectedBiome.chains.length} cadeias descobertas!</span>
          <Stars count={completed[selectedBiome.id] ?? 0} />
          <h1>A floresta<br /><em>ganhou vida!</em></h1>
          <p>{selectedBiome.fact}</p>
          <div className="victory-actions">
            <button type="button" className="wood-button wood-button--light" onClick={() => openMission(selectedBiome)}>Explorar novamente</button>
            {nextBiome ? (
              <button type="button" className="wood-button" onClick={() => openMission(nextBiome)}>Próximo bioma <span>→</span></button>
            ) : (
              <button type="button" className="wood-button" onClick={backToMap}>Ver jornada <span>→</span></button>
            )}
          </div>
        </section>
      </main>
    );
  }

  const producerNames = selectedBiome.species
    .filter((species) => species.role === "Produtor")
    .map((species) => species.name)
    .join(" ou ");
  const guideText = feedback === "wrong"
    ? "Essa relação não fecha. Comece por uma planta e observe quem pode se alimentar de quem."
    : feedback === "hint"
      ? `A energia começa em ${producerNames}. Depois, escolha um herbívoro e um predador.`
      : feedback === "correct"
        ? allChainsFound
          ? "Excelente! Você encontrou todas as cadeias deste bioma."
          : "Boa! Cadeia nova descoberta. Agora monte outra usando os seis seres vivos."
        : feedback === "repeat"
          ? "Essa cadeia já foi encontrada. Tente uma relação diferente."
          : `Há ${selectedBiome.chains.length} cadeias escondidas neste cenário. Quantas você consegue descobrir?`;

  return (
    <main className={`world-game biome-${selectedBiome.id} ${feedback === "wrong" ? "world-game--wrong" : ""} ${feedback === "correct" ? "world-game--correct" : ""}`} style={{ "--accent": selectedBiome.accent, "--deep": selectedBiome.deep } as React.CSSProperties} onPointerMove={moveWorld} onPointerLeave={restWorld}>
      {panorama(answer, chooseSpecies)}

      <header className="game-hud">
        <button type="button" className="game-back" onClick={backToMap} aria-label="Voltar ao mapa">← <span>Mapa</span></button>
        <div className="biome-plaque"><small>Nível {selectedBiome.level} • 6 seres no cenário</small><strong>{selectedBiome.name}</strong></div>
        <div className="mission-progress" aria-label={`${biomeDiscoveries.length} de ${selectedBiome.chains.length} cadeias descobertas`}><span>{biomeDiscoveries.length}</span><i /><span>{selectedBiome.chains.length}</span></div>
      </header>

      <aside className={`forest-guide forest-guide--${feedback}`} role="status">
        <div className="forest-guide__mascot" aria-hidden="true"><span>✦</span><i /><i /></div>
        <div><small>Sua missão</small><strong>{guideText}</strong></div>
      </aside>

      <section className="energy-path" aria-label="Ordem da cadeia alimentar">
        <div className="energy-path__header">
          <span className="energy-path__title">Monte uma cadeia</span>
          <span className="chain-discoveries" aria-label="Progresso das descobertas">
            {selectedBiome.chains.map((chain) => {
              const found = biomeDiscoveries.includes(chainKey(chain));
              return <i className={found ? "chain-dot chain-dot--found" : "chain-dot"} key={chainKey(chain)} aria-hidden="true">✦</i>;
            })}
            <strong>{biomeDiscoveries.length}/{selectedBiome.chains.length}</strong>
          </span>
        </div>
        <div className="energy-path__slots">
          {[0, 1, 2].map((slot) => {
            const species = selectedBiome.species.find((item) => item.id === answer[slot]);
            return (
              <div className={`seed-slot ${species ? "seed-slot--filled" : ""}`} key={slot}>
                {species ? (
                  <button type="button" onClick={() => removeSpecies(species.id)} aria-label={`Retirar ${species.name}`}>
                    <span><SpeciesArtwork species={species} /></span><strong>{species.name}</strong><i>×</i>
                  </button>
                ) : (
                  <><span>{slot + 1}</span><small>{slot === 0 ? "começa" : "depois"}</small></>
                )}
                {slot < 2 && <b aria-hidden="true">➜</b>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="game-actions">
        <button
          type="button"
          className="round-action"
          onClick={() => setFeedback("hint")}
          disabled={feedback === "correct" || feedback === "repeat"}
          aria-label="Mostrar dica"
        >?</button>
        {feedback === "correct" || feedback === "repeat" ? (
          <button type="button" className="wood-button" onClick={continueMission}>
            {allChainsFound ? "Concluir bioma" : "Montar outra"} <span>→</span>
          </button>
        ) : (
          <button type="button" className="wood-button" disabled={answer.length < 3} onClick={checkAnswer}>Conferir <span>→</span></button>
        )}
      </div>
      <p className="game-footnote">Os seis seres ficam no cenário • combine planta, herbívoro e predador</p>
    </main>
  );
}
