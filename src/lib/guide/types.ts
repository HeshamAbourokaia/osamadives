export type GuideLink = { label: string; href: string };

export type GuideAnswer = {
  id: string;
  text: string;
  sources?: GuideLink[];
  actions?: GuideLink[];
  suggestions?: string[];
};

export type GuideTopic = GuideAnswer & { phrases: string[] };

export type GuideProfile = {
  title: string;
  subtitle: string;
  welcome: string;
  suggestions: string[];
  contact: GuideLink;
  topics: GuideTopic[];
  fallback: string;
  /** The date the answers were last checked against the site, shown in the footer. */
  reviewed: string;
};
