export interface observerProps {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  options?: { rootMargin: string };
}

// posts
export interface paragraph {
  image?: string;
  text: string;
}

export interface comment {
  img?: string;
  name: string;
  comment: string;
  date?: string;
}

export interface post {
  id?: number | string;
  image?: string;
  category?: string;
  title?: string;
  date?: string;
  featured?: boolean;
  total_comments?: number;
  views?: number;
  tags?: string;
  author?: string;
  paragraphs?: paragraph[];
  comments?: comment[];
}

export interface postGen extends post {
  query?: string;
  short_text?: string;
  postError: string;
  postDataLoading: boolean;
}

// response
export interface paginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: (post | null)[];
}

export interface mainPosts {
  data: paginatedResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  navtabsData: string[];
  page: string;
  category?: string | undefined;
}

// archives and category tabs
export interface archiveTab {
  data: { text: string; count: number }[] | undefined;
  title: string;
}

export interface alert {
  show: boolean;
  message?: string;
  error?: boolean;
}
