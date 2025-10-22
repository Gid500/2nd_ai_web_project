# routes.py

import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from utils import allowed_file, hash_filename
# 'upload_bp'라는 이름의 블루프린트를 생성합니다. 
# URL 접두사를 '/api' 등으로 설정하여 API 엔드포인트를 구분할 수도 있습니다.
upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route('/upload-image', methods=['POST'])
def upload_image():
    """클라이언트로부터 이미지 파일을 받아 저장하는 엔드포인트입니다."""
    
    # current_app을 통해 config.py에서 설정된 'UPLOAD_FOLDER' 값에 접근합니다.
    upload_dir = current_app.config['UPLOAD_FOLDER']

    # 1. 요청에 'file' 필드가 포함되어 있는지 확인합니다.
    if 'file' not in request.files:
        return jsonify({'message': 'No file part (파일 필드가 없습니다)'}), 400
    
    file = request.files['file']
    
    # 2. 파일 이름이 비어 있는지 확인합니다. (파일이 선택되지 않은 경우)
    if file.filename == '':
        return jsonify({'message': 'No selected file (선택된 파일이 없습니다)'}), 400
    
    # 3. 파일이 존재하고 허용된 확장자인지 확인합니다.
    if file and allowed_file(file.filename):
        # 파일명 보안 처리 (경로 인젝션 방지)
        # 원본 파일 이름을 해시화하여 고유한 이름으로 만듭니다.
        hashed_name = hash_filename(file.filename)
        filename = secure_filename(hashed_name)
        
        # 4. 업로드 폴더가 없으면 생성합니다.
        if not os.path.exists(upload_dir):
            try:
                # exist_ok=True를 사용하여 이미 디렉토리가 있어도 에러가 발생하지 않도록 합니다.
                os.makedirs(upload_dir, exist_ok=True)
            except OSError as e:
                # 디렉토리 생성 실패 시 500 에러를 반환합니다.
                return jsonify({'message': f'Directory creation failed (디렉토리 생성 실패): {e}'}), 500
            
        # 5. 파일을 설정된 업로드 폴더에 저장합니다.
        save_path = os.path.join(upload_dir, filename)
        
        try:
            file.save(save_path)
        except Exception as e:
            # 파일 저장 실패 시 500 에러를 반환합니다.
            return jsonify({'message': f'File save failed (파일 저장 실패): {e}'}), 500
        
        # 6. 성공 응답을 반환합니다.
        image_url = request.url_root + 'uploads/' + filename
        return jsonify({
            'message': 'Image uploaded successfully (이미지 업로드 성공)', 
            'filename': filename, 
            'save_path': save_path,
            'image_url': image_url
        }), 200
    else:
        # 7. 허용되지 않은 파일 형식인 경우 400 에러를 반환합니다.
        return jsonify({'message': 'File type not allowed (허용되지 않은 파일 형식)'}), 400