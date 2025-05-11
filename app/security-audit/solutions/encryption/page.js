// app/security-audit/solutions/encryption/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function EncryptionPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">고유식별번호 암호화</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          주민등록번호, 여권번호, 운전면허번호 등의 고유식별정보는 개인정보보호법에 따라
          암호화하여 저장해야 합니다. 이 페이지에서는 고유식별번호 암호화 요구사항과
          구현 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">법적 요구사항</h2>
        <p>
          개인정보보호법 제24조 및 시행령 제21조에 따르면 다음과 같은 고유식별정보는
          반드시 암호화하여 저장해야 합니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>주민등록번호</li>
          <li>여권번호</li>
          <li>운전면허번호</li>
          <li>외국인등록번호</li>
          <li>신용카드번호</li>
          <li>계좌번호</li>
          <li>바이오 정보</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">암호화 대상 확인</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            시스템 데이터베이스 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                데이터베이스 내 저장된 모든 테이블에서 고유식별정보가 포함된 필드를 
                식별합니다.
              </li>
              <li>
                암호화되지 않은 상태로 저장된 고유식별정보가 있는지 확인합니다.
              </li>
            </ol>
          </li>
          <li>
            파일 및 문서 검사:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>시스템에 저장된 문서 파일(엑셀, 워드, PDF 등)에 고유식별정보가 포함되어 있는지 확인합니다.</li>
              <li>필요한 경우 문서 내 고유식별정보를 마스킹하거나 암호화합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">데이터베이스 암호화 방법</h2>
        <p>
          다음 암호화 방법 중 하나 이상을 구현하여 데이터베이스의 고유식별정보를 
          보호해야 합니다:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            애플리케이션 수준 암호화:
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>
                애플리케이션에서 데이터를 저장하기 전에 암호화하고 검색할 때 복호화하는 방식
              </li>
              <li>
                Java 애플리케이션 예시:
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "4px",
                    marginTop: "5px",
                    fontFamily: "monospace",
                  }}
                >
                  <code>
                    // AES 암호화 예시
                    <br />
                    SecretKey key = KeyGenerator.getInstance("AES").generateKey();
                    <br />
                    Cipher cipher = Cipher.getInstance("AES");
                    <br />
                    cipher.init(Cipher.ENCRYPT_MODE, key);
                    <br />
                    byte[] encryptedData = cipher.doFinal(
                      identificationNumber.getBytes()
                    );
                  </code>
                </div>
              </li>
            </ul>
          </li>
          <li>
            데이터베이스 수준 암호화:
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>
                데이터베이스 자체의 암호화 기능을 사용하는 방식
              </li>
              <li>
                MS-SQL 예시:
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "4px",
                    marginTop: "5px",
                    fontFamily: "monospace",
                  }}
                >
                  <code>
                    -- TDE(Transparent Data Encryption) 설정
                    <br />
                    USE master;
                    <br />
                    CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'StrongPassword123!';
                    <br />
                    CREATE CERTIFICATE TDECertificate WITH SUBJECT = 'TDE Certificate';
                    <br />
                    USE YourDatabase;
                    <br />
                    CREATE DATABASE ENCRYPTION KEY
                    <br />
                    WITH ALGORITHM = AES_256
                    <br />
                    ENCRYPTION BY SERVER CERTIFICATE TDECertificate;
                    <br />
                    ALTER DATABASE YourDatabase
                    <br />
                    SET ENCRYPTION ON;
                  </code>
                </div>
              </li>
            </ul>
          </li>
          <li>
            칼럼 수준 암호화:
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>
                특정 칼럼만 암호화하는 방식
              </li>
              <li>
                MS-SQL 예시:
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "4px",
                    marginTop: "5px",
                    fontFamily: "monospace",
                  }}
                >
                  <code>
                    -- 칼럼 암호화
                    <br />
                    CREATE TABLE Customers (
                    <br />
                    &nbsp;&nbsp;CustomerID INT PRIMARY KEY,
                    <br />
                    &nbsp;&nbsp;Name NVARCHAR(100),
                    <br />
                    &nbsp;&nbsp;SSN VARBINARY(256)
                    <br />
                    );
                    <br />
                    <br />
                    -- 암호화하여 데이터 삽입
                    <br />
                    INSERT INTO Customers (CustomerID, Name, SSN)
                    <br />
                    VALUES (1, 'John Doe', ENCRYPTBYPASSPHRASE('YourPassphrase', '123-45-6789'));
                  </code>
                </div>
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">암호화 키 관리</h2>
        <p>
          암호화 키의 안전한 관리는 암호화 시스템의 핵심입니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            암호화 키는 데이터와 별도의 보안 장치에 저장합니다.
          </li>
          <li>
            주기적으로 암호화 키를 변경합니다(권장: 1년에 1회 이상).
          </li>
          <li>
            키 접근 권한은 필요한 관리자에게만 제한적으로 부여합니다.
          </li>
          <li>
            키 백업 절차를 마련하고 정기적으로 검증합니다.
          </li>
          <li>
            HSM(Hardware Security Module)을 사용하여 키를 안전하게 관리하는 것을 권장합니다.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">고유식별정보 표시 마스킹</h2>
        <p>
          화면에 고유식별정보를 표시할 때는 일부만 표시하고 나머지는 
          마스킹 처리하는 것이 좋습니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            주민등록번호: 앞 6자리와 뒷자리 중 1자리만 표시 (예: 123456-1******)
          </li>
          <li>
            신용카드번호: 앞 6자리와 뒤 4자리만 표시 (예: 123456******1234)
          </li>
          <li>
            계좌번호: 앞 4자리와 뒤 4자리만 표시 (예: 1234********5678)
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">개인정보 검색 및 암호화 확인</h2>
        <p>
          시스템 내 개인정보 검색 및 암호화 확인을 위한 도구 사용 방법:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            개인정보 검색 도구 사용:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>개인정보 검색 도구를 실행합니다. (데스크톱/로컬 드라이브)</li>
              <li>검색 범위를 설정하고 검색을 실행합니다.</li>
              <li>발견된 모든 개인정보 파일을 목록화합니다.</li>
            </ol>
          </li>
          <li>
            데이터베이스 암호화 검증:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>암호화가 적용된 테이블 구조를 확인합니다.</li>
              <li>샘플 데이터를 검사하여 암호화가 올바르게 적용되었는지 확인합니다.</li>
              <li>
                복호화 프로세스가 적절한 권한을 가진 사용자에게만 허용되는지 확인합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          고유식별정보 암호화 구현이나 확인에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>데이터 보안팀: 내선 5678 또는 data-security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}