from config import ALLOWED_EXTENSIONS

def allowed_file(filename):
    """
    파일 이름의 확장자가 허용된 목록(ALLOWED_EXTENSIONS)에 있는지 확인합니다.
    예: 'my_image.png' -> True, 'document.pdf' -> False
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS