export const SiteRouter = {
  index: '/',
  login: '/login',
  signUp: '/signup',
  signUpSuccess: '/signup/success',
  search: '/search',
  performanceList: '/performances',
  mypage: '/mypage',
  mypageInfo: '/mypage/info',
  userEdit: '/mypage/info/edit',
  changePassword: '/mypage/password',
  findAccount: '/find-account',
  performances: (id: string | number) => `/performances/${id}`,
} as const
