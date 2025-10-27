루트 디렉토리의 `README.MD` 파일은 이 프로젝트의 `frontend` 디렉토리가 React 기반의 웹 애플리케이션임을 명확히 보여줍니다. 주요 내용은 다음과 같습니다:

### `frontend/src` 디렉토리 구조

*   **`asset/`**: 이미지, CSS 등 정적 자원들을 관리하며, 특히 `asset/css/`는 전반적인 스타일과 컴포넌트/페이지별 스타일을 정의합니다.
*   **`common/`**: 애플리케이션 전반에 걸쳐 재사용되는 공통 컴포넌트 및 유틸리티 함수들을 모아둡니다. `common/hook/`에는 사용자 입력 처리와 같은 커스텀 React 훅들이 포함됩니다.
*   **`pages/`**: 각 웹 페이지를 구성하는 컴포넌트들을 담고 있습니다. 각 하위 디렉토리(예: `about`, `admin`, `error`, `home`, `posts`, `signin`, `signup`)는 특정 페이지와 관련된 모든 파일(메인 컴포넌트, API 호출 로직, 하위 컴포넌트, 커스텀 훅 등)을 포함합니다.
    *   `pages/posts/components/`는 게시글 페이지 내에서 사용되는 하위 컴포넌트들을 포함합니다.
*   **주요 파일**:
    *   `App.jsx`: 애플리케이션의 메인 진입점이며, 라우팅 설정 및 전역 레이아웃을 정의합니다.
    *   `index.jsx`: React 애플리케이션을 DOM에 마운트하는 초기 설정 파일입니다.
    *   `App.css` / `index.css`: 각각 `App.jsx` 컴포넌트와 전역 스타일에 적용되는 CSS 파일입니다.

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

### 프로젝트 전체 파일 및 디렉토리 용도 설명

#### 프로젝트 루트 디렉토리 (`/home/qod110/Documents/Project/2nd_ai_web_project/`)

*   **`package-lock.json`**: Node.js 프로젝트의 정확한 의존성 트리를 기록하여, 팀원 간 또는 배포 환경에서 일관된 패키지 설치를 보장합니다.
*   **`README.MD`**: 프로젝트에 대한 전반적인 정보, 설정 방법, 사용법 등을 담고 있는 문서입니다.
*   **`.git/`**: Git 버전 관리 시스템의 저장소로, 프로젝트의 모든 변경 이력과 설정을 관리합니다.
*   **`.idea/`**: IntelliJ IDEA와 같은 JetBrains IDE의 프로젝트 설정 파일들을 포함합니다.
*   **`logs/`**: 애플리케이션 실행 중에 발생하는 로그 파일들을 저장하는 디렉토리입니다.
*   **`sql/`**: 데이터베이스 스키마, 마이그레이션 스크립트, 초기 데이터 등 SQL 관련 파일들을 포함합니다.

#### `ai_backend/` 디렉토리 (Python Flask 기반 AI 백엔드)

*   **`.gitignore`**: Git이 추적하지 않을 파일 및 디렉토리 패턴을 정의합니다. (예: `__pycache__`, `.env` 등)
*   **`app.py`**: Flask 애플리케이션의 메인 진입점으로, 앱 인스턴스 생성, CORS 설정, 블루프린트 등록, 정적 파일 제공 라우트 등을 담당합니다.
*   **`cat_predictor.py`**: 고양이 이미지의 감정을 예측하는 AI 모델 로직을 포함합니다. 이미지 전처리, 모델 로드, 예측 수행 등의 기능을 제공합니다.
*   **`config.py`**: Flask 애플리케이션 및 AI 백엔드에서 사용되는 설정 값(예: 업로드 폴더, 허용 확장자, OpenAI API 키)을 정의합니다.
*   **`dog_predictor.py`**: 강아지 이미지의 감정을 예측하는 AI 모델 로직을 포함합니다. 고양이 예측기와 유사한 기능을 수행합니다.
*   **`readme.md`**: `ai_backend` 모듈에 대한 별도의 설명 문서입니다.
*   **`routes.py`**: Flask 블루프린트를 사용하여 이미지 업로드 및 AI 예측 관련 API 엔드포인트(라우트)를 정의합니다.
*   **`utils.py`**: 파일 확장자 검사, 파일명 해싱, OpenAI API를 이용한 예측 결과 분석 등 여러 유틸리티 함수들을 제공합니다.
*   **`__pycache__/`**: Python 인터프리터가 `.pyc` 파일을 저장하는 디렉토리로, Python 모듈의 바이트코드 캐시를 포함합니다.

#### `ai_model/` 디렉토리 (AI 모델 관련 파일)

*   **`.gitignore`**: Git이 추적하지 않을 파일 및 디렉토리 패턴을 정의합니다.
*   **`dog_emotion_mobilenet_transfer_leaning.ipynb`**: 강아지 감정 인식 모델을 위한 전이 학습(Transfer Learning) 과정을 담은 Jupyter Notebook 파일입니다.
*   **`train_cat_emotion_mobilenet_v2.py`**: 고양이 감정 인식 모델을 MobileNetV2 기반으로 학습시키는 Python 스크립트입니다.
*   **`train_cat_emotion_model.ipynb`**: 고양이 감정 인식 모델 학습 과정을 담은 Jupyter Notebook 파일입니다.
*   **`Cat Emotions.v1-test.folder/`**: 고양이 감정 인식 모델 테스트를 위한 데이터셋 또는 관련 파일들을 포함하는 폴더입니다.
*   **`uploaded_img/`**: AI 모델 예측을 위해 업로드된 이미지 파일들이 임시로 저장될 수 있는 디렉토리입니다.

#### `backend/` 디렉토리 (Java Spring Boot 백엔드)

*   **`.gitattributes`**: Git이 특정 파일 경로에 대해 속성을 정의하는 데 사용됩니다. (예: 텍스트 파일의 줄 끝 처리)
*   **`.gitignore`**: Git이 추적하지 않을 파일 및 디렉토리 패턴을 정의합니다.
*   **`build.gradle`**: Gradle 빌드 시스템의 설정 파일로, 프로젝트의 의존성, 빌드 스크립트 등을 정의합니다.
*   **`gradlew`, `gradlew.bat`**: Gradle Wrapper 스크립트로, Gradle이 설치되어 있지 않아도 프로젝트를 빌드할 수 있게 해줍니다. (`.bat`은 Windows용)
*   **`settings.gradle`**: Gradle 멀티 프로젝트 빌드에서 서브 프로젝트를 정의하는 데 사용됩니다.
*   **`.gradle/`**: Gradle 빌드 시스템이 생성하는 캐시 및 설정 파일들을 포함합니다.
*   **`.idea/`**: IntelliJ IDEA와 같은 JetBrains IDE의 프로젝트 설정 파일들을 포함합니다.
*   **`bin/`**: 컴파일된 클래스 파일이나 실행 가능한 바이너리 파일들이 저장될 수 있는 디렉토리입니다.
*   **`build/`**: Gradle 빌드 결과물(컴파일된 코드, JAR 파일, 테스트 결과 등)이 저장되는 디렉토리입니다.
*   **`gradle/`**: Gradle Wrapper 관련 파일들을 포함합니다.
*   **`logs/`**: Spring Boot 애플리케이션 실행 중에 발생하는 로그 파일들을 저장하는 디렉토리입니다.
*   **`src/main/java/com/revia/`**: Spring Boot 애플리케이션의 주 Java 소스 코드가 위치하는 패키지입니다.
*   **`src/main/resources/application.properties`**: Spring Boot 애플리케이션의 설정 파일로, 데이터베이스 연결 정보, 서버 포트 등을 정의합니다.
*   **`src/main/resources/mybatis/mapper/`**: MyBatis 프레임워크의 SQL 매퍼 XML 파일들이 위치하는 디렉토리입니다.
*   **`src/test/java/com/revia/`**: Spring Boot 애플리케이션의 테스트 코드가 위치하는 패키지입니다.
*   **`uploaded_img/`**: 백엔드에서 처리하기 위해 업로드된 이미지 파일들이 저장될 수 있는 디렉토리입니다.

#### `frontend/` 디렉토리 (React 웹 애플리케이션)

*   **`.env`**: 환경 변수를 정의하는 파일로, API 키나 개발/배포 환경별 설정을 포함합니다.
*   **`.gitignore`**: Git이 추적하지 않을 파일 및 디렉토리 패턴을 정의합니다.
*   **`package-lock.json`**: Node.js 프로젝트의 정확한 의존성 트리를 기록하여, 팀원 간 또는 배포 환경에서 일관된 패키지 설치를 보장합니다.
*   **`package.json`**: Node.js 프로젝트의 메타데이터(이름, 버전, 스크립트, 의존성 등)를 정의합니다.
*   **`README.md`**: `frontend` 모듈에 대한 별도의 설명 문서입니다.
*   **`build/`**: React 애플리케이션을 빌드한 결과물(정적 파일)이 저장되는 디렉토리입니다.
*   **`node_modules/`**: Node.js 프로젝트의 모든 의존성 패키지들이 설치되는 디렉토리입니다.
*   **`public/`**: 웹 서버에 직접 제공되는 정적 파일(HTML, 이미지, 파비콘 등)을 포함합니다.
*   **`src/`**: React 애플리케이션의 모든 소스 코드가 위치하는 디렉토리입니다. (자세한 내용은 `README.MD`에 설명되어 있습니다.)