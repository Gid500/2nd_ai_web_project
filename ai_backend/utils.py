import os
import uuid
from config import ALLOWED_EXTENSIONS

def allowed_file(filename):
    """
    파일 이름의 확장자가 허용된 목록(ALLOWED_EXTENSIONS)에 있는지 확인합니다.
    예: 'my_image.png' -> True, 'document.pdf' -> False
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def hash_filename(filename):
    """
    원본 파일 이름을 랜덤한 문자열로 해시하여 고유한 파일 이름을 생성합니다.
    확장자는 유지됩니다.
    """
    # 파일 이름과 확장자를 분리합니다.
    name, ext = os.path.splitext(filename)
    # UUID를 사용하여 고유한 문자열을 생성합니다.
    unique_id = uuid.uuid4().hex
    # 랜덤한 문자열과 원래 확장자를 결합하여 반환합니다.
    return f"{unique_id}{ext}"