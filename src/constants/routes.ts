export const SiteRouter = {
  index: '/',
  login: '/login',
  signUp: '/signup',
  signUpSuccess: '/signup/success',
  mypage: '/mypage',
  mypageInfo: '/mypage/info',
  userEdit: '/mypage/info/edit',
  changePassword: '/mypage/password',
  findAccount: '/find-account',
  performances: (id: string) => `/performances/${id}`,
} as const
