"use client";

import { AlertCircle, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

import type { InsightCardData } from "@/lib/finance-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightsPanelProps {
  insights: InsightCardData[];
  compact?: boolean;
}

export function InsightsPanel({ insights, compact = false }: InsightsPanelProps) {
  return (
    <section className="space-y-4">
      {compact ? (
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Insights
          </p>
          <h2 className="mt-2 font-heading text-3xl text-foreground">
            Quick reads
          </h2>
        </div>
      ) : (
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Insights
            </p>
            <h2 className="mt-2 font-heading text-3xl text-foreground">
              What the numbers are saying
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Lightweight observations generated from the full persisted dataset, not
            just the currently filtered table.
          </p>
        </div>
      )}

      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "lg:grid-cols-3"}`}>
        {insights.map((insight) => {
          const toneStyles =
            insight.tone === "positive"
              ? {
                  card: "border-chart-2/22 bg-chart-2/6",
                  icon: <TrendingUp className="size-5 text-chart-2" />,
                }
              : insight.tone === "caution"
                ? {
                    card: "border-chart-5/22 bg-chart-5/6",
                    icon: <TrendingDown className="size-5 text-chart-5" />,
                  }
                : {
                    card: "border-primary/18 bg-primary/6",
                    icon: <Sparkles className="size-5 text-primary" />,
                  };

          return (
            <Card
              key={insight.id}
              className={`border bg-card/90 shadow-[0_18px_54px_rgba(74,62,38,0.07)] backdrop-blur ${toneStyles.card}`}
            >
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-2xl border border-border/70 bg-background/85 p-3 shadow-sm">
                    {toneStyles.icon}
                  </div>
                  <AlertCircle className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <CardDescription>{insight.title}</CardDescription>
                  <CardTitle className={`mt-2 ${compact ? "text-xl" : "text-2xl"}`}>
                    {insight.headline}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">
                  {insight.detail}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
