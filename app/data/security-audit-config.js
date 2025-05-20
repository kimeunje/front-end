// app/data/security-audit-config.js

/**
 * 상시보안감사 시스템의 전체 메뉴 구조와 라우팅 정보를 정의합니다.
 * 새로운 메뉴 항목을 추가하려면 이 파일만 수정하면 됩니다.
 */

// 메뉴 ID는 라우팅에 사용되는 고유 식별자입니다
export const MENU_STRUCTURE = [
  {
    id: "results", // 메뉴 ID (URL 경로로 사용됨)
    title: "검사결과", // 표시될 메뉴 제목
    path: "/security-audit/results",
    subItems: [],
  },
  {
    id: "solutions",
    title: "조치방법",
    path: "/security-audit/solutions",
    subItems: [
      {
        id: "screen-saver",
        title: "화면보호기 점검",
        path: "/security-audit/solutions/screen-saver",
      },
      {
        id: "auto-run",
        title: "이동매체 자동실행 점검",
        path: "/security-audit/solutions/auto-run",
      },
      {
        id: "antivirus",
        title: "백신 상태 점검",
        path: "/security-audit/solutions/antivirus",
      },
      {
        id: "password-policy",
        title: "패스워드 정책 점검",
        path: "/security-audit/solutions/password-policy",
      },
      {
        id: "firewall",
        title: "방화벽 정책 점검",
        path: "/security-audit/solutions/firewall",
      },
      {
        id: "shared-folder",
        title: "공유폴더 점검",
        path: "/security-audit/solutions/shared-folder",
      },
      {
        id: "remote-desktop",
        title: "원격 데스크톱 점검",
        path: "/security-audit/solutions/remote-desktop",
      },
    ],
  },
  {
    id: "contact",
    title: "문의하세요",
    path: "/security-audit/contact",
    subItems: [],
  },
];

/**
 * 페이지 네비게이션에 사용할 평탄화된 메뉴 항목 배열을 생성합니다.
 * 이 함수는 중첩된 메뉴 구조를 1차원 배열로 변환합니다.
 */
export function getFlatMenuItems() {
  const flatItems = [];

  // 메뉴 구조를 순회하며 모든 항목을 평탄화된 배열에 추가
  MENU_STRUCTURE.forEach((mainItem) => {
    // 메인 항목 추가
    flatItems.push({
      id: mainItem.id,
      title: mainItem.title,
      path: mainItem.path,
      isMainItem: true,
      parentId: null,
    });

    // 하위 항목 추가
    if (mainItem.subItems && mainItem.subItems.length > 0) {
      mainItem.subItems.forEach((subItem) => {
        flatItems.push({
          id: subItem.id,
          title: subItem.title,
          path: subItem.path,
          isMainItem: false,
          parentId: mainItem.id,
        });
      });
    }
  });

  return flatItems;
}

/**
 * 주어진 경로에 해당하는 메뉴 항목을 찾습니다.
 */
export function findMenuItemByPath(path) {
  const flatItems = getFlatMenuItems();
  return flatItems.find((item) => item.path === path);
}

/**
 * 주어진 ID에 해당하는 메뉴 항목을 찾습니다.
 */
export function findMenuItemById(id) {
  const flatItems = getFlatMenuItems();
  return flatItems.find((item) => item.id === id);
}

/**
 * 현재 메뉴 항목의 다음 항목을 찾습니다.
 */
export function getNextMenuItem(currentPath) {
  const flatItems = getFlatMenuItems();
  const currentIndex = flatItems.findIndex((item) => item.path === currentPath);

  if (currentIndex !== -1 && currentIndex < flatItems.length - 1) {
    return flatItems[currentIndex + 1];
  }

  return null;
}

/**
 * 현재 메뉴 항목의 이전 항목을 찾습니다.
 */
export function getPreviousMenuItem(currentPath) {
  const flatItems = getFlatMenuItems();
  const currentIndex = flatItems.findIndex((item) => item.path === currentPath);

  if (currentIndex > 0) {
    return flatItems[currentIndex - 1];
  }

  return null;
}