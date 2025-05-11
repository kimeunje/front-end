// app/security-audit/solutions/usb/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function UsbDevicePage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">USB 및 외부 장치 사용</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          USB 드라이브와 외부 저장 장치는 편리하지만 심각한 보안 위험을 초래할 수 있습니다.
          이 페이지에서는 USB 및 외부 장치 사용에 대한 보안 정책과 안전한 사용 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">USB 장치 관련 위험</h2>
        <p>
          USB 및 외부 장치 사용으로 인한 주요 보안 위험:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>악성 코드 유입:</strong> USB 장치를 통해 악성 소프트웨어가 시스템에 
            유입될 수 있습니다.
          </li>
          <li>
            <strong>데이터 유출:</strong> 허가되지 않은 USB 장치로 민감한 데이터가 
            유출될 수 있습니다.
          </li>
          <li>
            <strong>악성 USB 장치(BadUSB):</strong> 키보드로 위장한 USB 장치가 
            악성 명령을 실행할 수 있습니다.
          </li>
          <li>
            <strong>승인되지 않은 장치 연결:</strong> 승인되지 않은 외부 하드웨어가 
            시스템에 연결되어 보안 위험을 초래할 수 있습니다.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">USB 장치 제어 정책</h2>
        <p>
          기업의 USB 장치 사용에 관한 정책:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            <strong>승인된 장치 사용:</strong> 회사에서 승인 및 발급한 USB 장치만 
            사용이 허용됩니다.
          </li>
          <li>
            <strong>장치 등록 절차:</strong> 모든 USB 장치는 사용 전에 IT 부서에 등록하고 
            승인을 받아야 합니다.
          </li>
          <li>
            <strong>중요 데이터 처리:</strong> 기밀 또는 민감한 데이터를 USB 장치로 
            복사할 경우, 암호화된 보안 USB를 사용해야 합니다.
          </li>
          <li>
            <strong>외부 장치 스캔:</strong> 외부에서 가져온 모든 USB 장치는 연결 전에 
            반드시 악성 코드 스캔을 해야 합니다.
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">USB 포트 제어 방법</h2>
        <p>
          시스템의 USB 포트 접근을 제어하는 방법:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            그룹 정책을 통한 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                Windows 키 + R을 누르고 <code>gpedit.msc</code>를 입력하여 그룹 정책 편집기를 
                실행합니다.
              </li>
              <li>
                컴퓨터 구성 → 관리 템플릿 → 시스템 → 이동식 저장소 접근으로 이동합니다.
              </li>
              <li>
                "이동식 디스크에 대한 모든 접근 거부" 정책을 "사용"으로 설정하여 
                모든 USB 장치를 차단하거나, 다른 정책을 적용하여 특정 장치만 허용할 수 있습니다.
              </li>
            </ol>
          </li>
          <li>
            엔드포인트 보안 솔루션 사용:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                엔드포인트 보안 솔루션을 통해 USB 장치 사용을 제어합니다.
              </li>
              <li>
                장치 제어 정책을 구성하여 승인된 USB 장치만 사용할 수 있도록 합니다.
              </li>
              <li>
                장치 연결 및 파일 작업에 대한 로그를 기록하여 모니터링합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">USB 장치 암호화</h2>
        <p>
          USB 장치 암호화를 통한 데이터 보호 방법:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            BitLocker To Go 사용(Windows):
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>USB 드라이브를 컴퓨터에 연결합니다.</li>
              <li>파일 탐색기에서 USB 드라이브를 마우스 오른쪽 버튼으로 클릭합니다.</li>
              <li>"BitLocker 켜기"를 선택합니다.</li>
              <li>암호 또는 스마트 카드를 사용하여 드라이브를 보호할 방법을 선택합니다.</li>
              <li>강력한 암호를 설정하고 복구 키를 안전한 위치에 저장합니다.</li>
            </ol>
          </li>
          <li>
            하드웨어 암호화 USB 드라이브 사용:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                물리적 키패드가 있는 암호화 USB 드라이브를 사용합니다.
              </li>
              <li>
                제조업체의 지침에 따라 암호를 설정하고 안전하게 보관합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">USB 장치 안전 사용 지침</h2>
        <p>
          USB 장치를 안전하게 사용하기 위한 사용자 지침:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            출처가 불분명한 USB 장치는 절대 사용하지 마세요.
          </li>
          <li>
            개인 USB 장치를 회사 컴퓨터에 연결하기 전에 항상 IT 부서의 허가를 받으세요.
          </li>
          <li>
            USB 장치를 연결하기 전에 최신 바이러스 백신으로 검사하세요.
          </li>
          <li>
            USB 장치에 저장된 중요 데이터는 사용 후 안전하게 삭제하세요.
          </li>
          <li>
            USB 장치를 분실하거나 도난당한 경우 즉시 IT 부서에 보고하세요.
          </li>
          <li>
            공용 컴퓨터(인터넷 카페, 호텔 등)에서는 가능한 USB 장치 사용을 자제하세요.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">기타 외부 장치 관리</h2>
        <p>
          USB 외에도 다양한 외부 장치에 대한 보안 관리 방법:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>외장 하드 드라이브:</strong> USB 드라이브와 동일한 보안 정책 적용
          </li>
          <li>
            <strong>블루투스 장치:</strong> 사용하지 않을 때는 블루투스 기능을 비활성화하고, 
            페어링 시 PIN 코드를 사용하여 보안 강화
          </li>
          <li>
            <strong>외부 CD/DVD 드라이브:</strong> 승인된 미디어만 사용하도록 제한
          </li>
          <li>
            <strong>스마트폰 및 태블릿:</strong> 회사 컴퓨터에 연결 시 데이터 전송 제한 및 
            모니터링
          </li>
          <li>
            <strong>디지털 카메라:</strong> 업무용으로 승인된 장치만 연결 허용
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">승인된 USB 장치 목록</h2>
        <p>
          다음 USB 장치는 IT 부서에서 사전 승인되었으며 보안 정책에 따라 사용할 수 있습니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>회사에서 발급한 암호화 USB 메모리</li>
          <li>승인된 외장 하드 드라이브 모델</li>
          <li>회사 표준 키보드 및 마우스</li>
          <li>업무용으로 승인된 외장 광학 드라이브</li>
          <li>IT 부서에서 승인한 다기능 장치(프린터, 스캐너 등)</li>
        </ul>
        <p style={{ marginTop: "10px" }}>
          위 목록에 없는 장치를 사용해야 하는 경우 IT 부서의 승인을 받아야 합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">위반 시 조치</h2>
        <p>
          USB 및 외부 장치 보안 정책 위반 시 조치:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            1차 위반: 구두 경고 및 보안 인식 교육 참석
          </li>
          <li>
            2차 위반: 서면 경고 및 추가 보안 교육 필수 이수
          </li>
          <li>
            3차 위반: USB 및 외부 장치 사용 권한 일시 정지 및 인사 조치
          </li>
          <li>
            심각한 위반(데이터 유출 등): 회사 정책에 따른 징계 조치 및 법적 조치 가능
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          USB 및 외부 장치 사용에 관한 문의나 승인 요청은 아래 담당자에게 연락하세요:
        </p>
        <p>보안 관리팀: 내선 2345 또는 device-security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}