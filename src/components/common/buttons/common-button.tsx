import styles from './common-button.module.scss';
type ButtonProps = {
  variant: 'gradient' | 'line';
  text: string;
  icon?: React.ReactNode;
};

export default function CommonButton({ variant, text, icon }: ButtonProps) {
  return (
    <button className={`${styles.commonButton} ${styles[variant]}`}>
      {icon && <span className={styles.commonButtonIcon}>{icon}</span>}
      {text}
    </button>
  );
}
