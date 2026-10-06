"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  ExternalLink,
  GitBranch,
  GitFork,
  MapPin,
  Star,
} from "lucide-react";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio";

const formatRelativeDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

export default function HomePage() {
  const portfolio = usePublicPortfolio();
  const data = portfolio.data?.data;
  const profile = data?.profile;
  const bio = profile?.bio ?? "";
  const bioText = bio
    .replace(/https?:\/\/[^\s|]+/g, "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" · ");
  const bioLinks = Array.from(bio.matchAll(/https?:\/\/[^\s|]+/g), (match) => match[0]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        {portfolio.isPending ? (
          <div className="py-12"><LoadingState message="Loading portfolio…" /></div>
        ) : portfolio.isError ? (
          <div className="py-12">
            <EmptyState
              title="Portfolio data is unavailable"
              description={portfolio.error instanceof Error ? portfolio.error.message : "Please try again in a moment."}
              icon={<Code2 className="size-5" />}
              action={
                <Button variant="outline" onClick={() => void portfolio.refetch()}>
                  Try again
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <section className="grid gap-10 border-b border-border/70 py-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  Public GitHub portfolio
                </div>
                <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  Building useful software,{" "}
                  <span className="text-primary">one thoughtful detail</span>{" "}
                  at a time.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {bioText ||
                    `I'm ${profile?.name || profile?.username || "a software developer"}. I build practical products and share my work in the open.`}
                </p>
                {bioLinks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                    {bioLinks.slice(0, 2).map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        {url.split("//")[1]?.split("/")[0] || "External profile"} <ArrowUpRight className="size-3.5" />
                      </a>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" render={<Link href="/repositories" />}>
                    Explore my work <ArrowRight aria-hidden="true" />
                  </Button>
                  {profile?.profileUrl && (
                    <Button size="lg" variant="outline" render={<a href={profile.profileUrl} target="_blank" rel="noreferrer" />}>
                      GitHub profile <ArrowUpRight aria-hidden="true" />
                    </Button>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  {profile?.location && (
                    <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{profile.location}</span>
                  )}
                  <a href="#featured" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
                    Scroll to explore <ArrowDown className="size-4" />
                  </a>
                </div>
              </div>

              <Card className="relative overflow-hidden border-border/70 bg-card p-0">
                <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-16 rounded-2xl border border-border sm:size-20">
                      <AvatarImage src={profile?.avatarUrl ?? undefined} alt={profile?.name || profile?.username || "GitHub profile"} />
                      <AvatarFallback className="rounded-2xl bg-secondary text-lg font-semibold text-secondary-foreground">
                        {(profile?.name || profile?.username || "WH").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 pt-1">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Developer profile</p>
                      <h2 className="mt-1 truncate text-xl font-semibold tracking-tight">{profile?.name || profile?.username || "GitHub profile"}</h2>
                      {profile?.username && (
                        <a className="mt-1 inline-block text-sm text-muted-foreground transition-colors hover:text-primary" href={profile.profileUrl} target="_blank" rel="noreferrer">
                          @{profile.username}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {[
                      { label: "Public repositories", value: data?.stats.repositories ?? 0, icon: GitBranch },
                      { label: "GitHub stars", value: data?.stats.stars ?? 0, icon: Star },
                      { label: "Forks", value: data?.stats.forks ?? 0, icon: GitFork },
                      { label: "Languages", value: data?.stats.languages ?? 0, icon: Code2 },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="rounded-xl border border-border/70 bg-muted/40 p-4">
                        <Icon className="size-4 text-primary" aria-hidden="true" />
                        <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{value.toLocaleString()}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="featured" className="scroll-mt-24 py-14 md:py-16">
              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Selected work</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Featured repositories</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">A selection of public projects, ranked by community interest.</p>
                </div>
                <Link href="/repositories" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                  All repositories <ArrowRight className="size-4" />
                </Link>
              </div>
              {data?.repositories.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {data.repositories.slice(0, 3).map((repository) => (
                    <Card key={repository.id} className="group h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                      <CardContent className="flex h-full flex-col p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                            <GitBranch className="size-5" aria-hidden="true" />
                          </div>
                          <a href={repository.htmlUrl} target="_blank" rel="noreferrer" aria-label={`Open ${repository.fullName} on GitHub`} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <ExternalLink className="size-4" />
                          </a>
                        </div>
                        <h3 className="mt-5 truncate font-semibold tracking-tight">
                          <Link href={`/repositories/${encodeURIComponent(repository.name)}`} className="group-hover:text-primary">{repository.name}</Link>
                        </h3>
                        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">{repository.description || "A public project from the GitHub portfolio."}</p>
                        <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                          {repository.primaryLanguage && <span className="flex min-w-0 items-center gap-2 truncate"><span className="size-2 rounded-full bg-primary" />{repository.primaryLanguage}</span>}
                          <span className="ml-auto inline-flex shrink-0 items-center gap-1"><Star className="size-3.5" />{repository.stars.toLocaleString()}</span>
                          <span className="inline-flex shrink-0 items-center gap-1"><GitFork className="size-3.5" />{repository.forks.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState title="No featured repositories yet" description="Public projects will appear here when they are available in the portfolio." />
              )}
            </section>

            <section className="grid gap-10 border-t border-border/70 py-14 md:py-16 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">What I work with</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Skills from shipped code</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Language metrics are calculated from the actual source in public repositories.</p>
                <Link href="/skills" className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
                  Explore all skills <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(data?.skills ?? []).slice(0, 6).map((skill) => {
                  const score = Math.max(0, Math.min(100, Number(skill.score) || 0));
                  return (
                    <div key={skill.id} className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm shadow-foreground/[0.02]">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-sm font-semibold">{skill.name}</h3>
                        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">{skill.level}</span>
                      </div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{skill.repositoriesCount} {skill.repositoriesCount === 1 ? "repository" : "repositories"}</p>
                    </div>
                  );
                })}
                {!data?.skills.length && <EmptyState title="Skills data is not available" description="Sync public repository language data to display skills." />}
              </div>
            </section>

            <section id="about" className="scroll-mt-24 grid gap-8 border-t border-border/70 py-14 md:py-16 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">A little about me</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Curious by default. Practical by design.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {bioText || "I enjoy turning complex ideas into useful, maintainable software. This portfolio is connected to my public GitHub data, so projects and activity reflect real work rather than a static showcase."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile?.company && <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">{profile.company}</span>}
                  {profile?.location && <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">{profile.location}</span>}
                </div>
              </div>
              <Card className="self-start">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Recent GitHub activity</p>
                      <h3 className="mt-1 font-semibold">Work in progress</h3>
                    </div>
                    <Link href="/activity" aria-label="View all activity" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><ArrowUpRight className="size-4" /></Link>
                  </div>
                  {data?.activities.length ? (
                    <ol className="mt-5 space-y-4">
                      {data.activities.slice(0, 4).map((activity) => (
                        <li key={activity.id} className="flex gap-3 border-t border-border/70 pt-4 first:border-0 first:pt-0">
                          <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"><GitBranch className="size-3.5" /></span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{activity.title || activity.type}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{activity.description || activity.repository?.name || "GitHub activity"}</p>
                            <time className="mt-1 block text-[11px] text-muted-foreground" dateTime={activity.occurredAt}>{formatRelativeDate(activity.occurredAt)}</time>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-5 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">No recent public activity is available yet.</p>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
