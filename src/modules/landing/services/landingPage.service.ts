import { http } from "../../../shared/api";
import { landingEndpoint } from "../constants/landingPage.const";
import type {
  LandingPageContent,
  LandingPageDto,
} from "../models/landingPage.model";
import { toLandingPageContent } from "../utils/landingPageMapper";

/**
 * The request being made right now, if any. Asking again while it's in flight joins it instead of
 * sending a second one (React StrictMode mounts the page's effect twice in dev, and without this
 * the API is called twice). Once it settles, the next call is a fresh request.
 */
let inFlight: Promise<LandingPageContent> | null = null;

export function fetchLandingPage(): Promise<LandingPageContent> {
  inFlight ??= http
    .get<LandingPageDto>(landingEndpoint)
    .then(toLandingPageContent)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}
