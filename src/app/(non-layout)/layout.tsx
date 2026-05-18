import styles from './styles/non-layout.module.scss';
export default function NonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.nonLayout}>
      <div className={styles.gradientTop} />
      {children}
      <div className={styles.gradientBottom} />
    </div>
  );
}
