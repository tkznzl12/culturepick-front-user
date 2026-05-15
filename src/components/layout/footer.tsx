import styles from './footer.module.scss';
import genreList from '../../data/ganre';
import Logo from '../../assets/logo.svg';
import Link from 'next/link';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerContentItem}>
            <span className="span-image">
              <Image src={Logo.src} alt="로고" fill />
            </span>
            <p>국내 모든 공연 정보를 한 곳에서.</p>
            <p> AI와 함께 나만의 공연을 찾아보세요.</p>
          </div>
          <div className={styles.footerContentItem}>
            <p className={styles.footerContentTitle}>공연 카테고리</p>
            <div className={styles.footerContentList}>
              {genreList.map((genre, index) => (
                <Link href="" key={`footer-genre-${index}`}>
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.footerContentItem}>
            <p className={styles.footerContentTitle}>서비스</p>
            <div className={styles.footerContentList}>
              {genreList.map((genre, index) => (
                <Link href="" key={`footer-genre-${index}`}>
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.footerContentItem}>
            <p className={styles.footerContentTitle}>고객지원</p>
            <div className={styles.footerContentList}>
              <p>이메일: support@culturepick.kr</p>
              <p>운영시간: 평일 10:00~18:00</p>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCaption}>
            © 2026 컬처픽. All rights reserved.
          </p>
          <div className={styles.footerTerms}>
            <p>이용약관</p>
            <p>개인정보 처리방침</p>
            <p>사업자 정보</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
