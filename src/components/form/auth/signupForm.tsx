'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './auth-form.module.scss';
import EyeIcon from '@/assets/icons/eye.svg';
import CloseEyeIcon from '@/assets/icons/close-eye.svg';
import LockIcon from '@/assets/icons/lock.svg';
import MailIcon from '@/assets/icons/mail.svg';
import CommonButton from '@/components/common/buttons/common-button';
import Link from 'next/link';
import { SiteRouter } from '@/data/router';
import Image from 'next/image';

export default function SignUpForm() {
  // 비밀번호 보기
  const [showPassword, setShowPassword] = useState<Boolean | null>(null);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<Boolean | null>(null);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    nickname: '',
  });
  // state 변경 시 재렌더링되기 때문에 useEffect 불필요
  const passwordRules = {
    length: signupData.password.length >= 8,
    english: /[A-Za-z]/.test(signupData.password),
    number: /\d/.test(signupData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(signupData.password),
  };

  const passedCount = Object.values(passwordRules).filter(Boolean).length;

  const strengthClass =
    passedCount === 4
      ? styles.strong
      : passedCount >= 2
        ? styles.medium
        : styles.weak;

  const checkListText = ['8자 이상','영문'];

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupData({ ...signupData, [id]: value });
  };

  useEffect(() => {
    setShowPassword(false);
    setShowPasswordConfirm(false);
  }, []);

  return (
    <form className={styles.form} onSubmit={() => {}}>
      <div className={styles.formData}>
        <label htmlFor="id">닉네임</label>
        <div className={styles.formInput}>
          <span className="span-image">
            <Image fill src={MailIcon.src} alt="nickname" />
          </span>
          <input
            type="text"
            id="nickname"
            value={signupData.nickname}
            onChange={(e) => handleOnChange(e)}
          />
        </div>
      </div>
      <div className={styles.formData}>
        <label htmlFor="id">이메일</label>
        <div className={styles.formInput}>
          <span className="span-image">
            <Image fill src={MailIcon.src} alt="email" />
          </span>
          <input
            type="text"
            id="email"
            value={signupData.email}
            onChange={(e) => handleOnChange(e)}
          />
        </div>
      </div>
      <div className={styles.formData}>
        <label htmlFor="password">비밀번호</label>
        <div className={styles.formInput}>
          <span className="span-image">
            <Image fill src={LockIcon.src} alt="lock" />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={signupData.password}
            onChange={(e) => handleOnChange(e)}
          />
          <button
            type="button"
            className={styles.showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Image fill src={EyeIcon.src} alt="eye" />
            ) : (
              <Image fill src={CloseEyeIcon.src} alt="close-eye" />
            )}
          </button>
        </div>
        <div className={styles.passwordStrength}>
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`${styles.strengthBar} ${passedCount >= item ? strengthClass : ''}`}
            />
          ))}
        </div>
        <ul>
          <li>8자이상</li>
        </ul>
      </div>
      <div className={styles.formData}>
        <label htmlFor="password">비밀번호 확인</label>
        <div className={styles.formInput}>
          <span className="span-image">
            <Image fill src={LockIcon.src} alt="lock" />
          </span>
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            id="password_confirm"
            value={signupData.password_confirm}
            onChange={(e) => handleOnChange(e)}
          />
          <button
            type="button"
            className={styles.showPassword}
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            {showPasswordConfirm ? (
              <Image fill src={EyeIcon.src} alt="eye" />
            ) : (
              <Image fill src={CloseEyeIcon.src} alt="close-eye" />
            )}
          </button>
        </div>
      </div>
      <CommonButton variant="gradient-shadow" text="회원가입" type="submit" />
    </form>
  );
}
