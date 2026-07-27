# 로하스건축사사무소 - GitHub 업로드 및 Netlify / GitHub Pages 배포 가이드

이 프로젝트는 Vite + React 기반으로 제작되었으며, GitHub 업로드 및 **Netlify**와 **GitHub Pages** 배포가 가능하도록 설정되어 있습니다.

---

## 1. Netlify 배포 방법 (추천)

Netlify는 GitHub 리포지토리와 연동하여 자동으로 지속적 배포(CI/CD)를 제공합니다.

### 배포 절차
1. [Netlify 홈페이지](https://www.netlify.com/)에 로그인 후 **"Add new site"** -> **"Import an existing project"**를 클릭합니다.
2. **GitHub**를 선택하고 프로젝트 리포지토리를 연결합니다.
3. 빌드 설정은 설정 파일(`netlify.toml`)에 의해 **자동으로 감지**됩니다:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **"Deploy site"**를 클릭하면 배포가 진행됩니다.

> 💡 **안내**: SPA 라우팅 리다이렉트 설정(`netlify.toml` 및 `public/_redirects`)이 프로젝트에 포함되어 있어 배포 후 페이지 새로고침 404 에러 없이 정상 작동합니다.

---

## 2. GitHub 리포지토리에 코드 업로드 (Push) 방법

### 방법 A: AI Studio 상단 메뉴에서 바로 내보내기 (가장 쉬운 방법)
1. 우측 상단 **Export / Share** (또는 설정 메뉴) 클릭
2. **Export to GitHub** 선택
3. 계정 연동 후 새 리포지토리 생성 및 푸시 진행

### 방법 B: 내 컴퓨터(로컬)에서 Git으로 업로드하기
ZIP 파일로 다운로드받은 경우 로컬 터미널에서 아래 명령어를 실행합니다.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/사용자이름/리포지토리이름.git
git push -u origin main
```

---

## 3. GitHub Pages 웹사이트 자동 배포 설정 방법 (선택사항)

GitHub Pages로 배포하고 싶으신 경우:

1. **GitHub 저장소(Repository)** 페이지로 이동합니다.
2. **Settings** 탭 -> 좌측 메뉴의 **Pages** 클릭
3. **Build and deployment** 항목 아래 **Source** 메뉴에서:
   - **GitHub Actions** 를 선택합니다.
4. 이제 `main` 브랜치에 코드가 푸시될 때마다 **Actions** 탭에서 자동으로 빌드 및 배포가 진행됩니다.

