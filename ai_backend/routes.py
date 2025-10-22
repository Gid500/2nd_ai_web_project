# routes.py

import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from utils import allowed_file, hash_filename
from ai_predictor import predict_image_emotion
# 'upload_bp'라는 이름의 블루프린트를 생성합니다. 
# URL 접두사를 '/api' 등으로 설정하여 API 엔드포인트를 구분할 수도 있습니다.
upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route('/upload-image', methods=['POST'])
def upload_image():
    """클라이언트로부터 이미지 파일을 받아 저장하는 엔드포인트입니다."""
    
    # current_app을 통해 config.py에서 설정된 'UPLOAD_FOLDER' 값에 접근합니다.
    # upload_dir = current_app.config['UPLOAD_FOLDER'] # 더 이상 사용되지 않음

    # 1. 요청에 'file' 필드가 포함되어 있는지 확인합니다.
    if 'file' not in request.files:
        return jsonify({'message': 'No file part (파일 필드가 없습니다)'}), 400
    
    file = request.files['file']
    
    # 2. 파일 이름이 비어 있는지 확인합니다. (파일이 선택되지 않은 경우)
    if file.filename == '':
        return jsonify({'message': 'No selected file (선택된 파일이 없습니다)'}), 400
    
    # 3. 파일이 존재하고 허용된 확장자인지 확인합니다.
    if file and allowed_file(file.filename):
        # 파일명 보안 처리 (경로 인젝션 방지) - 더 이상 저장하지 않으므로 필요 없지만, filename을 위해 유지
        # hashed_name = hash_filename(file.filename)
        # filename = secure_filename(hashed_name)
        filename = secure_filename(file.filename) # 원본 파일명 사용 또는 해시 유지
        
        # 4. 업로드 폴더 생성 로직 제거 (더 이상 저장하지 않음)
        # if not os.path.exists(upload_dir):
        #     try:
        #         os.makedirs(upload_dir, exist_ok=True)
        #     except OSError as e:
        #         return jsonify({'message': f'Directory creation failed (디렉토리 생성 실패): {e}'}), 500
            
        # 5. 파일을 설정된 업로드 폴더에 저장하는 로직 제거
        # save_path = os.path.join(upload_dir, filename)
        # try:
        #     file.save(save_path)
        # except Exception as e:
        #     return jsonify({'message': f'File save failed (파일 저장 실패): {e}'}), 500
        
        # AI 모델 예측 수행 (파일 객체를 직접 전달)
        prediction_result = predict_image_emotion(file)
        print(f"AI Prediction Result for {filename}: {prediction_result}")

        response_data = {
            'message': 'Image processed successfully (이미지 처리 성공)', 
            'filename': filename, 
            # 'save_path': save_path, # 더 이상 반환하지 않음
            # 'image_url': image_url # 더 이상 반환하지 않음
        }
        response_data.update(prediction_result)

        return jsonify(response_data), 200
    else:
        # 7. 허용되지 않은 파일 형식인 경우 400 에러를 반환합니다.
        return jsonify({'message': 'File type not allowed (허용되지 않은 파일 형식)'}), 400