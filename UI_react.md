# 🎨 AiStylist UI & React 작동 가이드

이 문서는 **AiStylist** 프로젝트의 프론트엔드 구조와 React가 어떻게 화면을 제어하는지 설명합니다.

---

## 🏗️ 컴포넌트 구조 (Component Structure)

현재 프로젝트는 단일 컴포넌트(`App.tsx`)를 중심으로 구성되어 있습니다.

- **`main.tsx`**: 프로젝트의 입구입니다. `App` 컴포넌트를 브라우저의 실제 HTML(`index.html`)에 연결해주는 역할을 합니다.
- **`App.tsx`**: 메인 UI 로직과 화면 구성을 담당합니다.
- **`App.css`**: `App` 컴포넌트 전용 스타일 시트입니다.
- **`index.css`**: 프로젝트 전체에 적용되는 공통 스타일(폰트, 배경색 등)을 정의합니다.

---

## ⚙️ 핵심 작동 원리

### 1. 상태 관리 (State Management)
사용자가 입력하는 정보는 React의 `useState` 훅을 통해 실시간으로 관리됩니다.

```typescript
const [profile, setProfile] = useState<ProfileData>({
  photo: null,   // 업로드된 이미지 데이터 (Base64)
  height: '',    // 사용자의 키 (cm)
  weight: '',    // 사용자의 몸무게 (kg)
});
```

### 2. 이벤트 처리 (Event Handling)

#### 📸 사진 업로드 (Photo Upload)
- 원형 업로드 영역을 클릭하면 숨겨진 `<input type="file">`이 실행됩니다.
- 사용자가 파일을 선택하면 `FileReader` API를 통해 이미지를 **Base64** 문자열로 변환합니다.
- 변환된 데이터는 `profile.photo` 상태에 저장되어 화면에 즉시 미리보기가 표시됩니다.

#### ⌨️ 텍스트 입력 (Input Changes)
- `height`와 `weight` 입력창에 값을 넣으면 `handleInputChange` 함수가 실행됩니다.
- `[name]: value` 문법을 사용하여 하나의 함수로 여러 입력창의 상태를 효율적으로 업데이트합니다.

### 3. 스타일링 (Styling)
- **Flexbox & Grid**: `App.css`에서 `display: flex`와 `display: grid`를 사용하여 요소들을 중앙에 배치하고 나란히 정렬했습니다.
- **반응형 디자인**: `max-width`와 `grid-template-columns`를 활용하여 모바일과 데스크탑 환경 모두에서 보기 좋게 디자인되었습니다.

---

## 🔄 데이터 흐름도 (Data Flow)

1. **사용자 액션**: 사진 선택 또는 수치 입력
2. **이벤트 핸들러 실행**: `handlePhotoChange` 또는 `handleInputChange` 호출
3. **상태 업데이트**: `setProfile`을 통해 React 상태 변경
4. **리렌더링**: 변경된 상태에 따라 화면(미리보기 이미지, 입력값 등)이 즉시 갱신됨
5. **최종 제출**: '스타일 분석 시작하기' 버튼 클릭 시 `profile` 객체가 콘솔에 출력됨

---

## 💡 개발 팁
- 새로운 입력 항목을 추가하고 싶다면 `ProfileData` 인터페이스에 필드를 추가하고, `App.tsx`의 `form` 태그 안에 새로운 `input`을 추가하면 됩니다.
- 디자인을 바꾸고 싶다면 `App.css`의 `:root` 변수(`--primary-color` 등)를 수정해보세요!
