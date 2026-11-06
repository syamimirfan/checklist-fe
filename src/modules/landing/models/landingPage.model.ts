import type { ToneName } from "../../../shared/styles/theme";

/** Where the load of the landing content stands; `useLandingPage` returns this. */
export type LandingPageState =
  | { status: "loading" }
  | { status: "success"; content: LandingPageContent }
  | { status: "error"; message: string };

/** The whole `GET /api/landing/` response. */
export interface LandingPageDto {
  header: LandingHeaderDto;
  hero: LandingHeroDto;
  features: LandingFeatureDto[];
  testimonials: LandingTestimonialsDto;
  cta: LandingCtaDto;
}

export interface LandingHeaderDto {
  login_label: string;
  signup_label: string;
}

export interface LandingHeroDto {
  badge: string;
  title_prefix: string;
  /** Shown in the brand gradient, between the prefix and the suffix. */
  title_highlight: string;
  title_suffix: string;
  description: string;
  cta_label: string;
}

export interface LandingFeatureDto {
  id: string;
  title: string;
  description: string;
  /** A brand colour name; plain text on the wire, so the mapper checks it. */
  tone: string;
}

export interface LandingTestimonialDto {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface LandingTestimonialsDto {
  title: string;
  items: LandingTestimonialDto[];
}

export interface LandingCtaDto {
  title: string;
  description: string;
  button_label: string;
}

export interface LandingHeader {
  loginLabel: string;
  signupLabel: string;
}

export interface LandingHero {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  ctaLabel: string;
}

export interface LandingFeature {
  id: string;
  title: string;
  description: string;
  tone: ToneName;
}

export interface LandingTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface LandingTestimonials {
  title: string;
  items: LandingTestimonial[];
}

export interface LandingCta {
  title: string;
  description: string;
  buttonLabel: string;
}

/** What the page renders: the response above, camelCased and checked. */
export interface LandingPageContent {
  header: LandingHeader;
  hero: LandingHero;
  features: LandingFeature[];
  testimonials: LandingTestimonials;
  cta: LandingCta;
}
