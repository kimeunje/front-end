import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'NICE디앤비 - 상시보안감사',
  description: '나이스디앤비 상시보안감사 포털',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
