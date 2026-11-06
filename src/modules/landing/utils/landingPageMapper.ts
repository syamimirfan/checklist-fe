import {
  primaryTone,
  toneNames,
  type ToneName,
} from "../../../shared/styles/theme";
import type {
  LandingCta,
  LandingCtaDto,
  LandingFeature,
  LandingFeatureDto,
  LandingHeader,
  LandingHeaderDto,
  LandingHero,
  LandingHeroDto,
  LandingPageContent,
  LandingPageDto,
  LandingTestimonial,
  LandingTestimonialDto,
  LandingTestimonials,
  LandingTestimonialsDto,
} from "../models/landingPage.model";

export function toLandingHeader(dto: LandingHeaderDto): LandingHeader {
  return { loginLabel: dto.login_label, signupLabel: dto.signup_label };
}

export function toLandingHero(dto: LandingHeroDto): LandingHero {
  return {
    badge: dto.badge,
    titlePrefix: dto.title_prefix,
    titleHighlight: dto.title_highlight,
    titleSuffix: dto.title_suffix,
    description: dto.description,
    ctaLabel: dto.cta_label,
  };
}

/** A colour the theme doesn't know (the backend added one first) falls back to the brand colour instead of crashing the page. */
function toTone(value: string): ToneName {
  return (toneNames as string[]).includes(value)
    ? (value as ToneName)
    : primaryTone;
}

export function toLandingFeature(dto: LandingFeatureDto): LandingFeature {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    tone: toTone(dto.tone),
  };
}

export function toLandingTestimonial(
  dto: LandingTestimonialDto,
): LandingTestimonial {
  return {
    id: dto.id,
    quote: dto.quote,
    author: dto.author,
    role: dto.role,
  };
}

export function toLandingTestimonials(
  dto: LandingTestimonialsDto,
): LandingTestimonials {
  return { title: dto.title, items: dto.items.map(toLandingTestimonial) };
}

export function toLandingCta(dto: LandingCtaDto): LandingCta {
  return {
    title: dto.title,
    description: dto.description,
    buttonLabel: dto.button_label,
  };
}

export function toLandingPageContent(dto: LandingPageDto): LandingPageContent {
  return {
    header: toLandingHeader(dto.header),
    hero: toLandingHero(dto.hero),
    features: dto.features.map(toLandingFeature),
    testimonials: toLandingTestimonials(dto.testimonials),
    cta: toLandingCta(dto.cta),
  };
}
