import os

# 현재 파일이 있는 디렉토리 경로 (프로젝트 루트 경로)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# 업로드 폴더 설정 (프로젝트 루트 디렉토리 아래의 'uploaded_img')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploaded_img')

# 허용할 이미지 확장자 설정
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}