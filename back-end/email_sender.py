# email_sender.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# 사용자 환경 설정
SMTP_SERVER = 'smtp.your-email-provider.com'
SMTP_PORT = 587
SMTP_USERNAME = 'your-email@example.com'
SMTP_PASSWORD = 'your-email-password'  # 환경변수로 관리 권장


def send_verification_email(recipient_email, verification_code):
    # 메일 내용 구성
    message = MIMEMultipart()
    message['From'] = SMTP_USERNAME
    message['To'] = recipient_email
    message['Subject'] = '상시보안감사 로그인 인증 코드'

    # HTML 형식 메일 본문
    html = f'''
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">상시보안감사 로그인 인증</h2>
          <p>안녕하세요, 상시보안감사 시스템 로그인을 위한 인증 코드입니다.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3 style="margin: 0; font-size: 24px; letter-spacing: 5px;">{verification_code}</h3>
          </div>
          <p>인증 코드는 15분간 유효합니다.</p>
          <p>본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.</p>
        </div>
      </body>
    </html>
    '''

    # 메일 본문 설정
    message.attach(MIMEText(html, 'html'))

    # SMTP 서버 연결 및 메일 발송
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # TLS 암호화 시작
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(message)
        server.quit()
    except Exception as e:
        print(f"이메일 발송 중 오류: {str(e)}")
        raise