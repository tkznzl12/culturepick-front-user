//qurey Type
type SearchQueryProps = {
  root: string;
  genre?: string;
  pageNum?: string;
  pageSize?: string;
  sorted?: string;
  keyword?: string;
  local?: string;
  status?: string;
};

export const SiteRouter = {
  //고정 path
  index: '/',
  login: '/login',
  mypage: '/mypage',
  mypageInfo: '/mypage/info',
  userEdit: '/mypage/info/edit',
  changePassword: '/mypage/password',
  signUp: '/signup',
  findAccount: '/find-account',
  //동적
  performances: (id: string) => `/performances/${id}`,
  //query
  performancesList: (params: Omit<SearchQueryProps, 'root'>) =>
    createSearchQuery({
      root: '/performances',
      ...params,
    }),
  search: (params: Omit<SearchQueryProps, 'root'>) =>
    createSearchQuery({
      root: '/search',
      ...params,
    }),
};

export const createSearchQuery = ({
  root,
  genre,
  pageNum,
  pageSize,
  sorted,
  keyword,
  local,
  status,
}: SearchQueryProps) => {
  const params = new URLSearchParams();
  const queryObject = {
    genre,
    pageNum,
    pageSize,
    sorted,
    keyword,
    local,
    status,
  };

  Object.entries(queryObject).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();

  return queryString ? `${root}?${queryString}` : root;
};
