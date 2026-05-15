import LoginForm from '@/components/form/login/loginForm';
import styles from './page.module.scss';
import Link from 'next/link';

// login페이지
export default function Login() {
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <p className={styles.title}>로그인</p>
        <p className={styles.content}>컬처픽에 오신걸 환영합니다🎭</p>
        <div className={styles.lineContent}>
          <span />
          <p>또는 이메일로 로그인</p>
          <span />
        </div>
        {/* oAuth 구현 후 작업 예정 
        <div className={styles.oAuthList}></div> */}
        <LoginForm />
        <p className={styles.moveSignup}>
          아직 계정이 없으신가요? <Link href="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
