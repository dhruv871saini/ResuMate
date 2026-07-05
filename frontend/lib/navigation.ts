

export type PageId =
  | "dashboard"
  | "builder"
  | "analyzer"
  | "jobs"
  | "templates"
  | "resumes";

export type NavigateFn = (page: PageId) => void;