export type Locale = "ar" | "en";

export interface ChatMessage {
  sender: "customer" | "zamili";
  text: string;
  /** ms to show a typing indicator before this message appears */
  typingMs: number;
}

export interface DemoCard {
  id: string;
  chip: string;
  channel: string;
  title: string;
  sub: string;
}

export interface WhatsAppDemo extends DemoCard {
  contactName: string;
  messages: ChatMessage[];
}

export interface WidgetDemo extends DemoCard {
  messages: ChatMessage[];
}

export interface RecordsDemo extends DemoCard {
  productName: string;
  addingLabel: string;
  variantsLabel: string;
  variants: { size: string; color: string; price: string }[];
  question: string;
  answer: string;
}

export interface OrderDemo extends DemoCard {
  steps: { sender: "customer" | "zamili"; text: string }[];
  toast: string;
  inboxTitle: string;
  inboxLine: string;
  inboxStatus: string;
}

export interface VerticalItem {
  icon: string;
  name: string;
  problem: string;
  solution: string;
}

export interface PackItem {
  id: string;
  icon: string;
  name: string;
  outcome: string;
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
    ctaPrimary: string;
    ctaSecondary: string;
    statLabel1: string;
    statValue1: string;
    statLabel2: string;
    statValue2: string;
    statLabel3: string;
    statValue3: string;
  };
  demoCanvas: {
    eyebrow: string;
    heading: string;
    sub: string;
    whatsapp: WhatsAppDemo;
    widget: WidgetDemo;
    records: RecordsDemo;
    order: OrderDemo;
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
    modalChannelsLabel: string;
    modalSampleLabel: string;
    modalCta: string;
    closeLabel: string;
  };
  trust: {
    eyebrow: string;
    heading: string;
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
