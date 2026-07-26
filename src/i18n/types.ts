export type Locale = "ar" | "en";

export interface ChatMessage {
  sender: "customer" | "zamili";
  text: string;
  /** ms to show a typing indicator before this message appears */
  typingMs: number;
  /** optional photo attached to the message (path under /public) */
  image?: string;
  imageAlt?: string;
  /** optional multi-photo gallery (e.g. "here are a few colors we have") */
  images?: { src: string; alt: string }[];
  /** optional structured menu/catalog list (item + price rows) */
  menu?: { name: string; price: string }[];
  /** render as a voice-note bubble (waveform + duration) instead of plain text; `text` becomes the transcript shown beneath it */
  voice?: boolean;
  voiceDuration?: string;
}

export interface DemoCard {
  id: string;
  chip: string;
  channel: string;
  title: string;
  sub: string;
  /** benefit bullets shown next to the demo on its full-width scroll slide */
  bullets: string[];
}

/** Slide 1 — combined "asks, browses the menu, orders, confirms" conversation. */
export interface OrderingDemo extends DemoCard {
  contactName: string;
  messages: ChatMessage[];
}

/** Slide 2 — owner asks for a post, Zamili drafts and "publishes" it. */
export interface SocialMediaDemo extends DemoCard {
  prompt: string;
  generatingLabel: string;
  pageName: string;
  pageHandle: string;
  postTimeLabel: string;
  postText: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  publishedLabel: string;
}

/** Slide 3 — live operations board: incoming orders with a status toggle. */
export interface DashboardOrderRow {
  code: string;
  item: string;
  customer: string;
}

export interface DashboardDemo extends DemoCard {
  liveLabel: string;
  statusLabels: [string, string, string];
  orders: DashboardOrderRow[];
}

/** Slide 4 — KPI tiles + chart, then the agent produces a written report. */
export interface AnalyticsDemo extends DemoCard {
  stats: { label: string; value: number; prefix?: string; suffix?: string }[];
  chartLabel: string;
  reportPrompt: string;
  reportReply: string;
}

/** Slide 5 — admin defines a product (with a photo) in the knowledge base. */
export interface KnowledgeDemo extends DemoCard {
  productName: string;
  categoryLabel: string;
  addingLabel: string;
  uploadLabel: string;
  image: string;
  imageAlt: string;
  variantsLabel: string;
  variants: { size: string; color: string; price: string }[];
  availabilityLabel: string;
  question: string;
  answer: string;
}

/** Slide 6 — upload documents in any format; every answer is grounded in them only. */
export interface DocumentsDemo extends DemoCard {
  uploadingLabel: string;
  files: { name: string; format: string }[];
  readyLabel: string;
  question: string;
  answer: string;
  groundedNote: string;
}

/** Slide 7 — owner describes a custom need, Zamili assembles an agent pipeline. */
export interface CustomSolutionDemo extends DemoCard {
  prompt: string;
  buildingLabel: string;
  steps: { icon: string; label: string; detail: string }[];
  resultLabel: string;
}

export interface VerticalItem {
  icon: string;
  name: string;
  problem: string;
  solution: string;
}

export interface PackAgent {
  icon: string;
  name: string;
  role: string;
}

export interface PackItem {
  id: string;
  icon: string;
  name: string;
  outcome: string;
  agents: PackAgent[];
  channels: string[];
  sample: ChatMessage[];
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    logoAlt: string;
    demo: string;
    solutions: string;
    trust: string;
    bookDemo: string;
    toggleTo: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    growthLine: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statLabel1: string;
    statValue1: string;
    statLabel2: string;
    statValue2: string;
    statLabel3: string;
    statValue3: string;
    panelBadge: string;
    panelTitle: string;
    panelItem: string;
    panelOrderNo: string;
    panelStatus: string;
  };
  demoCanvas: {
    eyebrow: string;
    heading: string;
    sub: string;
    actionsNote: string;
    ordering: OrderingDemo;
    social: SocialMediaDemo;
    dashboard: DashboardDemo;
    analytics: AnalyticsDemo;
    knowledge: KnowledgeDemo;
    documents: DocumentsDemo;
    customSolution: CustomSolutionDemo;
  };
  verticals: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: VerticalItem[];
  };
  packs: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: PackItem[];
    agentsLabel: string;
    detailsLabel: string;
    modalChannelsLabel: string;
    modalSampleLabel: string;
    modalCta: string;
    closeLabel: string;
  };
  trust: {
    eyebrow: string;
    heading: string;
    growthIntro: string;
    items: { title: string; body: string }[];
    technicalNote: string;
  };
  bookDemo: {
    eyebrow: string;
    heading: string;
    sub: string;
    nameLabel: string;
    namePlaceholder: string;
    orgLabel: string;
    orgPlaceholder: string;
    typeLabel: string;
    typeOptions: string[];
    contactLabel: string;
    contactPlaceholder: string;
    problemLabel: string;
    problemPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    errorGeneric: string;
    errorRateLimit: string;
    privacyNote: string;
  };
  footer: {
    tagline: string;
    rightsLine: string;
  };
}
