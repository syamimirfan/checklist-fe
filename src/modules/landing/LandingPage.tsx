import { Link } from "react-router-dom";
import { Button, Card } from "../../shared/components/ui";
import { Footer, Header } from "../../shared/components/layout";
import { dummyTestimonials } from "./dummyData";
import {
  badgeSoftClasses,
  brandGradient,
  surface,
  text,
  toneClasses,
  cursorPointer,
} from "../../shared/styles/theme";
import {
  checklistsThatKeepYourWholeTeamInSync,
  inSync,
  login,
  nowWithSharedWorkspaces,
  planLaunchesTrackRecurringWorkAndNeverLoseATaskInAChatThreadAgain,
  readTheDocumentation,
  signup,
  wholeTeam,
  landingFeatures,
  trustedByTeamsByShip,
  readyToGetOrganized,
  createYourFreeAccount,
  createYourWorkspace,
} from "./constants/landingPage.const";

export function LandingPage() {
  return (
    <div className={`min-h-screen ${surface.page}`}>
      <Header>
        <Link to="/login">
          <Button
            variant="ghost"
            size="sm"
            className={`sm:h-11 sm:px-5 sm:text-sm ${cursorPointer}`}
          >
            {login}
          </Button>
        </Link>
        <Link to="/signup">
          <Button
            variant="primary"
            size="sm"
            className={`sm:h-11 sm:px-5 sm:text-sm ${cursorPointer}`}
          >
            {signup}
          </Button>
        </Link>
      </Header>
      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
          <span className={badgeSoftClasses}>{nowWithSharedWorkspaces}</span>
          <h1
            className={`mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${text.heading}`}
          >
            {checklistsThatKeepYourWholeTeamInSync}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: brandGradient }}
            >
              {wholeTeam}
            </span>{" "}
            {inSync}
          </h1>
          <p className={`mt-6 max-w-xl text-base sm:text-lg ${text.body}`}>
            {planLaunchesTrackRecurringWorkAndNeverLoseATaskInAChatThreadAgain}
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className={`w-full sm:w-auto ${cursorPointer}`}>
                {readTheDocumentation}
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {landingFeatures.map((feature) => (
              <Card key={feature.id} className="text-left">
                <span
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold ${toneClasses[feature.tone].bg} ${toneClasses[feature.tone].text}`}
                  aria-hidden="true"
                >
                  {feature.title.charAt(0)}
                </span>
                <h3 className={`text-base font-semibold ${text.heading}`}>
                  {feature.title}
                </h3>
                <p className={`mt-2 text-sm ${text.body}`}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className={`${surface.pageMuted} py-14 sm:py-20`}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              className={`text-center text-xl font-semibold sm:text-2xl ${text.heading}`}
            >
              {trustedByTeamsByShip}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {dummyTestimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <p className={`text-sm ${text.body}`}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className={`mt-4 text-sm font-semibold ${text.heading}`}>
                    {testimonial.author}
                  </p>
                  <p className={`text-sm ${text.muted}`}>{testimonial.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <h2 className={`text-2xl font-bold sm:text-3xl ${text.heading}`}>
            {readyToGetOrganized}
          </h2>
          <p className={`mt-3 ${text.body}`}>{createYourFreeAccount}</p>
          <Link to="/signup" className="mt-6 inline-block w-full sm:w-auto">
            <Button size="lg" className={`w-full sm:w-auto ${cursorPointer}`}>
              {createYourWorkspace}
            </Button>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
