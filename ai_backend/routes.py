# routes.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils import allowed_file, hash_filename
from cat_predictor import predict_cat_emotion
from dog_predictor import predict_dog_emotion

# 'upload_bp'라는 이름의 블루프린트를 생성합니다. 
# URL 접두사를 '/api' 등으로 설정하여 API 엔드포인트를 구분할 수도 있습니다.
upload_bp = Blueprint('upload_bp', __name__)

def process_image_upload(file, prediction_function):
    """
    공통 이미지 업로드 및 예측 처리 로직
    """
    # 2. 파일 이름이 비어 있는지 확인합니다. (파일이 선택되지 않은 경우)
    if file.filename == '':
        return jsonify({'message': 'No selected file (선택된 파일이 없습니다)'}), 400
    
    # 3. 파일이 존재하고 허용된 확장자인지 확인합니다.
    if file and allowed_file(file.filename):
        # 파일명 보안 처리 (경로 인젝션 방지) - 더 이상 저장하지 않으므로 필요 없지만, filename을 위해 유지
        hashed_name = hash_filename(file.filename)
        filename = secure_filename(hashed_name) # 원본 파일명 사용 또는 해시 유지
        
        # AI 모델 예측 수행 (파일 객체를 직접 전달)
        prediction_result = prediction_function(file)
        print(f"AI Prediction Result for {filename}: {prediction_result}")

        response_data = {
            'message': 'Image processed successfully (이미지 처리 성공)', 
            'filename': filename, 
        }
        response_data.update(prediction_result)

        return jsonify(response_data), 200
    else:
        # 7. 허용되지 않은 파일 형식인 경우 400 에러를 반환합니다.
        return jsonify({'message': 'File type not allowed (허용되지 않은 파일 형식)'}), 400


@upload_bp.route('/upload-cat-image', methods=['POST'])
def upload_cat_image():
    """클라이언트로부터 고양이 이미지 파일을 받아 감정을 예측하는 엔드포인트입니다."""
    # 1. 요청에 'file' 필드가 포함되어 있는지 확인합니다.
    if 'file' not in request.files:
        return jsonify({'message': 'No file part (파일 필드가 없습니다)'}), 400
    
    file = request.files['file']
    return process_image_upload(file, predict_cat_emotion)


@upload_bp.route('/upload-dog-image', methods=['POST'])
def upload_dog_image():
    """클라이언트로부터 강아지 이미지 파일을 받아 감정을 예측하는 엔드포인트입니다."""
    # 1. 요청에 'file' 필드가 포함되어 있는지 확인합니다.
    if 'file' not in request.files:
        return jsonify({'message': 'No file part (파일 필드가 없습니다)'}), 400
    
    file = request.files['file']
    return process_image_upload(file, predict_dog_emotion)