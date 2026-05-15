// 검색 쿼리 type
export type SearchQueryProps = {
  root: string;
  genre?: string;
  pageNum?: string;
  pageSize?: string;
  sorted?: string;
  keyword?: string;
  local?: string;
  status?: string;
};

export type genreListType = {
  name: string;
  code: string;
};
