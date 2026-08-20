export type Species = {
  id: string;
  name: string;
  role: "Produtor" | "Consumidor primário" | "Consumidor secundário";
  emoji: string;
  note: string;
  image?: string;
};

export type FoodChain = [string, string, string];

export type Biome = {
  id: string;
  level: number;
  region: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  accent: string;
  deep: string;
  fact: string;
  species: Species[];
  chains: FoodChain[];
};

const species = {
  castanheira: {
    id: "castanheira",
    name: "Castanheira-do-pará",
    role: "Produtor",
    emoji: "🌳",
    note: "Produz seu alimento usando a luz do Sol.",
    image: "/species/game-castanheira-v2.png",
  },
  cutia: {
    id: "cutia",
    name: "Cutia",
    role: "Consumidor primário",
    emoji: "🐾",
    note: "Alimenta-se de frutos e sementes, como as castanhas.",
    image: "/species/game-cutia-v2.png",
  },
  onca: {
    id: "onca",
    name: "Onça-pintada",
    role: "Consumidor secundário",
    emoji: "🐆",
    note: "É uma grande predadora de diferentes animais da floresta.",
    image: "/species/game-onca-ground-v3.png",
  },
  embauba: {
    id: "embauba",
    name: "Embaúba",
    role: "Produtor",
    emoji: "🌿",
    note: "Produz folhas usando a energia do Sol.",
    image: "/species/catalog-embauba-v1.png",
  },
  preguica: {
    id: "preguica",
    name: "Bicho-preguiça",
    role: "Consumidor primário",
    emoji: "🦥",
    note: "Passa boa parte do tempo nas árvores e se alimenta de folhas.",
    image: "/species/catalog-preguica-v1.png",
  },
  harpia: {
    id: "harpia",
    name: "Harpia",
    role: "Consumidor secundário",
    emoji: "🦅",
    note: "É uma grande ave de rapina que caça animais nas copas.",
    image: "/species/catalog-harpia-flying-v2.png",
  },
  capimCaatinga: {
    id: "capim-caatinga",
    name: "Capim nativo",
    role: "Produtor",
    emoji: "🌾",
    note: "Usa a luz solar para produzir alimento.",
    image: "/species/catalog-capim-v1.png",
  },
  prea: {
    id: "prea",
    name: "Preá",
    role: "Consumidor primário",
    emoji: "🐹",
    note: "Come folhas, brotos e sementes.",
    image: "/species/catalog-prea-v1.png",
  },
  carcara: {
    id: "carcara",
    name: "Carcará",
    role: "Consumidor secundário",
    emoji: "🦅",
    note: "É uma ave oportunista que também caça pequenos animais.",
    image: "/species/catalog-carcara-v1.png",
  },
  mandacaru: {
    id: "mandacaru",
    name: "Mandacaru",
    role: "Produtor",
    emoji: "🌵",
    note: "Faz fotossíntese e armazena água para resistir à seca.",
    image: "/species/catalog-mandacaru-v1.png",
  },
  moco: {
    id: "moco",
    name: "Mocó",
    role: "Consumidor primário",
    emoji: "🐹",
    note: "É um roedor da Caatinga que se alimenta de vegetais.",
    image: "/species/catalog-moco-v1.png",
  },
  oncaParda: {
    id: "onca-parda",
    name: "Onça-parda",
    role: "Consumidor secundário",
    emoji: "🐈",
    note: "É uma predadora ágil que caça diferentes animais.",
    image: "/species/catalog-onca-parda-v1.png",
  },
  capimCerrado: {
    id: "capim-cerrado",
    name: "Capim do Cerrado",
    role: "Produtor",
    emoji: "🌱",
    note: "Transforma energia solar em alimento.",
    image: "/species/catalog-capim-v1.png",
  },
  gafanhoto: {
    id: "gafanhoto",
    name: "Gafanhoto",
    role: "Consumidor primário",
    emoji: "🦗",
    note: "Alimenta-se de folhas e partes macias das plantas.",
    image: "/species/catalog-gafanhoto-v1.png",
  },
  seriema: {
    id: "seriema",
    name: "Seriema",
    role: "Consumidor secundário",
    emoji: "🐦",
    note: "Caça insetos e pequenos animais no chão.",
    image: "/species/catalog-seriema-v1.png",
  },
  pequizeiro: {
    id: "pequizeiro",
    name: "Pequizeiro",
    role: "Produtor",
    emoji: "🌳",
    note: "Produz folhas e frutos graças à energia do Sol.",
    image: "/species/catalog-pequizeiro-v1.png",
  },
  ratoCampo: {
    id: "rato-campo",
    name: "Rato-do-campo",
    role: "Consumidor primário",
    emoji: "🐭",
    note: "Procura sementes e outras partes de plantas.",
    image: "/species/catalog-rato-campo-v1.png",
  },
  loboGuara: {
    id: "lobo-guara",
    name: "Lobo-guará",
    role: "Consumidor secundário",
    emoji: "🦊",
    note: "Tem dieta variada e pode capturar pequenos roedores.",
    image: "/species/catalog-lobo-guara-v1.png",
  },
  figueira: {
    id: "figueira",
    name: "Figueira",
    role: "Produtor",
    emoji: "🌳",
    note: "Produz folhas e frutos usando a luz do Sol.",
    image: "/species/catalog-figueira-v1.png",
  },
  bugio: {
    id: "bugio",
    name: "Bugio",
    role: "Consumidor primário",
    emoji: "🐒",
    note: "Alimenta-se de folhas e frutos nas copas das árvores.",
    image: "/species/catalog-bugio-v1.png",
  },
  capimPampa: {
    id: "capim-pampa",
    name: "Capim nativo",
    role: "Produtor",
    emoji: "🌾",
    note: "Captura energia solar e inicia a cadeia.",
    image: "/species/catalog-capim-v1.png",
  },
  tucoTuco: {
    id: "tuco-tuco",
    name: "Tuco-tuco",
    role: "Consumidor primário",
    emoji: "🐭",
    note: "É um roedor subterrâneo que consome vegetais.",
    image: "/species/catalog-tuco-tuco-v1.png",
  },
  graxaim: {
    id: "graxaim",
    name: "Graxaim-do-campo",
    role: "Consumidor secundário",
    emoji: "🦊",
    note: "Tem dieta variada e pode caçar pequenos roedores.",
    image: "/species/catalog-graxaim-v1.png",
  },
  veadoCampeiro: {
    id: "veado-campeiro",
    name: "Veado-campeiro",
    role: "Consumidor primário",
    emoji: "🦌",
    note: "Pasta gramíneas e outras plantas dos campos.",
    image: "/species/catalog-veado-campeiro-v1.png",
  },
  butiazeiro: {
    id: "butiazeiro",
    name: "Butiazeiro",
    role: "Produtor",
    emoji: "🌴",
    note: "Produz folhas e frutos usando a energia do Sol.",
    image: "/species/catalog-butiazeiro-v1.png",
  },
} satisfies Record<string, Species>;

export const biomes: Biome[] = [
  {
    id: "amazonia",
    level: 1,
    region: "Norte",
    name: "Amazônia",
    eyebrow: "Floresta das grandes águas",
    description: "Uma floresta quente, úmida e cheia de relações entre plantas e animais.",
    image: "/biomes/biome-amazonia.png",
    accent: "#f5c84c",
    deep: "#174f38",
    fact: "A mesma floresta abriga muitas cadeias. Quando uma espécie muda, várias relações ao redor dela também podem mudar.",
    species: [species.castanheira, species.cutia, species.onca, species.embauba, species.preguica, species.harpia],
    chains: [
      ["castanheira", "cutia", "onca"],
      ["castanheira", "cutia", "harpia"],
      ["embauba", "cutia", "onca"],
      ["embauba", "cutia", "harpia"],
      ["embauba", "preguica", "harpia"],
      ["embauba", "preguica", "onca"],
    ],
  },
  {
    id: "caatinga",
    level: 2,
    region: "Nordeste",
    name: "Caatinga",
    eyebrow: "Vida que resiste ao calor",
    description: "Plantas e animais adaptados a longos períodos de pouca chuva.",
    image: "/biomes/biome-caatinga.png",
    accent: "#ffbd68",
    deep: "#813b24",
    fact: "Na Caatinga, plantas armazenam água ou perdem folhas na seca; os animais aproveitam diferentes alimentos ao longo do ano.",
    species: [species.capimCaatinga, species.prea, species.oncaParda, species.mandacaru, species.moco, species.carcara],
    chains: [
      ["capim-caatinga", "prea", "carcara"],
      ["mandacaru", "moco", "onca-parda"],
      ["capim-caatinga", "moco", "onca-parda"],
      ["mandacaru", "prea", "carcara"],
    ],
  },
  {
    id: "cerrado",
    level: 3,
    region: "Centro-Oeste",
    name: "Cerrado",
    eyebrow: "A savana mais biodiversa",
    description: "Campos, árvores retorcidas e raízes profundas formam um mosaico de vida.",
    image: "/biomes/biome-cerrado.png",
    accent: "#ffd85a",
    deep: "#5d5120",
    fact: "O Cerrado mistura campos e árvores. Por isso, insetos, aves e mamíferos podem participar de muitas cadeias diferentes.",
    species: [species.capimCerrado, species.gafanhoto, species.loboGuara, species.pequizeiro, species.ratoCampo, species.seriema],
    chains: [
      ["capim-cerrado", "gafanhoto", "seriema"],
      ["pequizeiro", "rato-campo", "lobo-guara"],
      ["pequizeiro", "gafanhoto", "seriema"],
      ["capim-cerrado", "rato-campo", "lobo-guara"],
    ],
  },
  {
    id: "mata-atlantica",
    level: 4,
    region: "Sudeste",
    name: "Mata Atlântica",
    eyebrow: "Floresta entre serra e mar",
    description: "Uma floresta úmida de muitas alturas, bromélias e espécies únicas.",
    image: "/biomes/biome-mata-atlantica.png",
    accent: "#78e1b2",
    deep: "#164d47",
    fact: "Das folhas no alto das árvores ao chão úmido, cada camada da Mata Atlântica oferece alimento e abrigo diferentes.",
    species: [species.embauba, species.preguica, species.onca, species.figueira, species.bugio, species.harpia],
    chains: [
      ["embauba", "preguica", "onca"],
      ["figueira", "bugio", "harpia"],
      ["figueira", "bugio", "onca"],
      ["embauba", "preguica", "harpia"],
    ],
  },
  {
    id: "pampa",
    level: 5,
    region: "Sul",
    name: "Pampa",
    eyebrow: "Campos de horizonte aberto",
    description: "Coxilhas, gramíneas e flores nativas abrigam uma fauna discreta e ágil.",
    image: "/biomes/biome-pampa.png",
    accent: "#d7ef7a",
    deep: "#35583c",
    fact: "Mesmo parecendo simples à distância, os campos do Pampa formam redes de alimento com muitas plantas, roedores e predadores.",
    species: [species.capimPampa, species.tucoTuco, species.oncaParda, species.butiazeiro, species.veadoCampeiro, species.graxaim],
    chains: [
      ["capim-pampa", "tuco-tuco", "graxaim"],
      ["capim-pampa", "veado-campeiro", "onca-parda"],
      ["butiazeiro", "veado-campeiro", "onca-parda"],
    ],
  },
];
