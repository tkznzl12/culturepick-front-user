import Link from 'next/link';
import styles from './common-button.module.scss';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: 'gradient' | 'line' | 'gradient-shadow';
  text: string;
  icon?: React.ReactNode;
  href?: string;
};

export default function CommonButton({
  variant,
  text,
  icon,
  href,
  ...props
}: ButtonProps) {
  return (
    <>
      {href ? (
        <Link
          href={href}
          className={`${styles.commonButton} ${styles[variant]}`}
        >
          {icon && <span className={styles.commonButtonIcon}>{icon}</span>}
          {text}
        </Link>
      ) : (
        <button
          className={`${styles.commonButton} ${styles[variant]}`}
          {...props}
        >
          {icon && <span className={styles.commonButtonIcon}>{icon}</span>}
          {text}
        </button>
      )}
    </>
  );
}
