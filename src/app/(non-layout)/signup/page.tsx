import { SiteRouter } from '@/data/router';
import styles from '../styles/auth-page.module.scss';
import Link from 'next/link';
import SignUpForm from '@/components/form/auth/signupForm';

export default function SignUp() {
  return (
    <div className={styles.auth}>
      <div className={styles.container}>
        <p className={styles.title}>회원가입</p>
        <p className={styles.content}>컬처픽 멤버가 되어 공연을 즐겨보세요🎭</p>
        <SignUpForm />
        <p className={styles.moveAuth}>
          이미 계정이 있으신가요? <Link href={SiteRouter.signUp}>로그인</Link>
        </p>
      </div>
    </div>
  );
}
