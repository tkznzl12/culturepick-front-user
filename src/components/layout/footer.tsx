import styles from './footer.module.scss';
import genreList from '../../data/ganre';
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className="footer-content-item">
          <p>국내 모든 공연 정보를 한 곳에서.</p>
          <p> AI와 함께 나만의 공연을 찾아보세요.</p>
        </div>
        <div className="footer-content-item">
          <p className="footer-content-title">공연 카테고리</p>
          {genreList.map((genre, index) => (
            <a href="" key={`footer-genre-${index}`}>
              {genre.name}
            </a>
          ))}
        </div>
        <div className="footer-content-item">
          <p className="footer-content-title">서비스</p>
          {genreList.map((genre, index) => (
            <a href="" key={`footer-genre-${index}`}>
              {genre.name}
            </a>
          ))}
        </div>
        <div className="footer-content-item">
          <p className="footer-content-title">고객지원</p>
          <div>
            <p>이메일: support@culturepick.kr</p>
            <p>운영시간: 평일 10:00~18:00</p>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className="footer-bottom-left">
          © 2026 컬처픽. All rights reserved.
        </p>
        <div>
          <p>이용약관</p>
          <p>개인정보 처리방침</p>
          <p>사업자 정보</p>
        </div>
      </div>
    </footer>
  );
}
