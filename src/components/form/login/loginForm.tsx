'use client';
import { useState } from 'react';
import styles from './loginForm.module.scss';
import EyeIcon from '@/assets/icons/eye.svg';
import CloseEyeIcon from '@/assets/icons/close-eye.svg';
import LockIcon from '@/assets/icons/lock.svg';
import MailIcon from '@/assets/icons/mail.svg';
import CommonButton from '@/components/common/buttons/common-button';
import Link from 'next/link';
import { SiteRouter } from '@/data/router';

export default function LoginForm() {
  // 비밀번호 보기
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={styles.form} onSubmit={() => {}}>
      <div className={styles.formData}>
        <label htmlFor="id">이메일</label>
        <div className={styles.formInput}>
          <span>
            <img src={MailIcon.src} alt="email" />
          </span>
          <input type="text" id="id" />
        </div>
      </div>
      <div className={styles.formData}>
        <label htmlFor="password">비밀번호</label>
        <div className={styles.formInput}>
          <span>
            <img src={LockIcon.src} alt="lock" />
          </span>
          <input type={showPassword ? 'text' : 'password'} id="password" />
          <button
            type="button"
            className={styles.showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <img src={EyeIcon.src} alt="eye" />
            ) : (
              <img src={CloseEyeIcon.src} alt="close-eye" />
            )}
          </button>
        </div>
      </div>
      <Link href={SiteRouter.index}>계정을 잊으셨나요?</Link>
      <CommonButton variant="gradient-shadow" text="로그인" type="submit" />
    </form>
  );
}
