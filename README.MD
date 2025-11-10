이미지로 동물 감정 분석 및 동물관련 커뮤니티 플랫폼

---

`ai_backend` 디렉토리의 Python 파일들을 분석한 결과, `pip`으로 설치해야 할 주요 라이브러리들은 다음과 같습니다:

```bash
pip install Flask Flask-Cors Werkzeug openai tensorflow numpy Pillow python-dotenv
```

각 라이브러리의 역할은 다음과 같습니다:
*   **Flask**: 웹 애플리케이션 프레임워크
*   **Flask-Cors**: Flask 애플리케이션에서 CORS(Cross-Origin Resource Sharing)를 처리
*   **Werkzeug**: Flask의 기반이 되는 WSGI 유틸리티 라이브러리 (일반적으로 Flask 설치 시 함께 설치됨)
*   **openai**: OpenAI API와 상호작용
*   **tensorflow**: AI 모델 학습 및 추론
*   **numpy**: 과학 계산을 위한 파이썬 라이브러리 (특히 텐서플로우와 함께 데이터 처리)
*   **Pillow**: 이미지 처리 라이브러리 (PIL fork)
*   **python-dotenv**: `.env` 파일에서 환경 변수를 로드

---

### `frontend/src` 디렉토리 구조

*   **`asset/`**: 이미지, CSS 등 정적 자원들을 관리하며, 특히 `asset/css/`는 전반적인 스타일과 컴포넌트/페이지별 스타일을 정의합니다.
*   **`common/`**: 애플리케이션 전반에 걸쳐 재사용되는 공통 컴포넌트 및 유틸리티 함수들을 모아둡니다. `common/hook/`에는 사용자 입력 처리와 같은 커스텀 React 훅들이 포함됩니다.
*   **`pages/`**: 각 웹 페이지를 구성하는 컴포넌트들을 담고 있습니다. 각 하위 디렉토리(예: `about`, `admin`, `error`, `home`, `posts`, `signin`, `signup`)는 특정 페이지와 관련된 모든 파일(메인 컴포넌트, API 호출 로직, 하위 컴포넌트, 커스텀 훅 등)을 포함합니다.
    *   `pages/posts/components/`는 게시글 페이지 내에서 사용되는 하위 컴포넌트들을 포함합니다.
*   **주요 파일**:
    *   `App.jsx`: 애플리케이션의 메인 진입점이며, 라우팅 설정 및 전역 레이아웃을 정의합니다.
    *   `index.jsx`: React 애플리케이션을 DOM에 마운트하는 초기 설정 파일입니다.
    *   `App.css` / `index.css`: 각각 `App.jsx` 컴포넌트와 전역 스타일에 적용되는 CSS 파일입니다.

### `backend/` 디렉토리 (Java Spring Boot 백엔드)

*   **`bin/`**: 컴파일된 클래스 파일이나 실행 가능한 바이너리 파일들이 저장될 수 있는 디렉토리입니다.
*   **`build/`**: Gradle 빌드 결과물(컴파일된 코드, JAR 파일, 테스트 결과 등)이 저장되는 디렉토리입니다.
*   **`gradle/`**: Gradle Wrapper 관련 파일들을 포함합니다.
*   **`logs/`**: Spring Boot 애플리케이션 실행 중에 발생하는 로그 파일들을 저장하는 디렉토리입니다.
*   **`src/main/java/com/revia/`**: Spring Boot 애플리케이션의 주 Java 소스 코드가 위치하는 패키지입니다.
*   **`src/main/resources/application.properties`**: Spring Boot 애플리케이션의 설정 파일로, 데이터베이스 연결 정보, 서버 포트 등을 정의합니다.
*   **`src/main/resources/mybatis/mapper/`**: MyBatis 프레임워크의 SQL 매퍼 XML 파일들이 위치하는 디렉토리입니다.
*   **`src/test/java/com/revia/`**: Spring Boot 애플리케이션의 테스트 코드가 위치하는 패키지입니다.
*   **`uploaded_img/`**: 백엔드에서 처리하기 위해 업로드된 이미지 파일들이 저장될 수 있는 디렉토리입니다.
