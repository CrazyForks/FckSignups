import { useEffect, useState } from "react";
import type { ToolSections } from "../hooks/useTools";
import type { Tool, Category, LoadStatus } from "../types";
import { ToolCard } from "./ToolCard";

interface ToolGridProps {
  sections: ToolSections;
  categories: Category[];
  loadStatus: LoadStatus;
  errorMessage: string;
  searchQuery: string;
  activeCategory: string;
  setSearchQuery: (query: string) => void;
}

export function ToolGrid({
  sections,
  categories,
  loadStatus,
  errorMessage,
  searchQuery,
  activeCategory,
  setSearchQuery,
}: ToolGridProps) {
  const [showMore, setShowMore] = useState(false);

  // Collapse "Meets Criteria" again whenever the filters change
  useEffect(() => {
    setShowMore(false);
  }, [searchQuery, activeCategory]);

  if (loadStatus === "loading") {
    return (
      <main className="grid">
        <div className="loading">Initializing index</div>
      </main>
    );
  }

  const { featured, editorsPicks, meetsCriteria } = sections;
  const totalCount = featured.length + editorsPicks.length + meetsCriteria.length;

  if (totalCount === 0) {
    return (
      <main className="grid">
        <div className="empty">
          <h3>NO MATCHES FOUND</h3>
          <p>Try a different search term or category filter.</p>
        </div>
      </main>
    );
  }

  // Meets Criteria stays behind "Show More" only while browsing; searching
  // always expands it so no matches are hidden.
  const hasCurated = featured.length > 0 || editorsPicks.length > 0;
  const searching = searchQuery.trim().length > 0;
  const meetsExpanded = !hasCurated || searching || showMore;

  return (
    <main className="tool-sections">
      {loadStatus == "error" && (
        <div className="error">
          <h3>ERR_LOAD_FAILED</h3>
          <p>{errorMessage}</p>
          <p style={{ marginTop: "1rem", fontSize: "0.8rem", opacity: 0.7 }}>
            Falling back to embedded dataset...
          </p>
        </div>
      )}

      {featured.length > 0 && (
        <Section
          label="Featured"
          variant="featured"
          tools={featured}
          categories={categories}
          setSearchQuery={setSearchQuery}
        />
      )}

      {editorsPicks.length > 0 && (
        <Section
          label="Editor's Picks"
          variant="editors"
          tools={editorsPicks}
          categories={categories}
          setSearchQuery={setSearchQuery}
        />
      )}

      {meetsCriteria.length > 0 &&
        (meetsExpanded ? (
          <Section
            label="Meets Criteria"
            variant="meets"
            tools={meetsCriteria}
            categories={categories}
            setSearchQuery={setSearchQuery}
          />
        ) : (
          <div className="show-more-wrap">
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowMore(true)}
            >
              Show More - {meetsCriteria.length} more{" "}
              {meetsCriteria.length === 1 ? "tool meets" : "tools meet"} the
              criteria
            </button>
          </div>
        ))}
    </main>
  );
}

interface SectionProps {
  label: string;
  variant: "featured" | "editors" | "meets";
  tools: Tool[];
  categories: Category[];
  setSearchQuery: (query: string) => void;
}

function Section({
  label,
  variant,
  tools,
  categories,
  setSearchQuery,
}: SectionProps) {
  return (
    <section className={`tool-section tool-section--${variant}`}>
      <div className="section-divider">{label}</div>
      <div className="grid border-glow">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            category={categories.find((c) => c.id === tool.category)}
            setSearchQuery={setSearchQuery}
          />
        ))}
      </div>
    </section>
  );
}
