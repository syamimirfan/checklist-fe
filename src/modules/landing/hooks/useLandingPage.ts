import { useEffect, useState } from "react";
import { useApiErrorHandler } from "../../../app/hooks";
import { fetchLandingPage } from "../services/landingPage.service";
import { unexpectedErrorMessage } from "../constants/landingPage.const";
import type { LandingPageState } from "../models/landingPage.model";

export function useLandingPage(): LandingPageState {
  const [state, setState] = useState<LandingPageState>({ status: "loading" });
  const handleApiError = useApiErrorHandler();

  useEffect(() => {
    // In dev, StrictMode runs this effect, cleans it up, and runs it again. `fetchLandingPage`
    // hands both runs the same single request; `ignore` makes the discarded first run drop its result.
    let ignore = false;
    fetchLandingPage()
      .then((content) => {
        if (!ignore) setState({ status: "success", content });
      })
      .catch((error) => {
        if (ignore) return;
        handleApiError(error);
        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : unexpectedErrorMessage,
        });
      });
    return () => {
      ignore = true;
    };
  }, [handleApiError]);

  return state;
}
