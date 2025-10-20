import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename 

# 업로드 폴더 설정 (사용자 요청에 따라 /uploaded_img로 변경)
# 참고: 이 경로는 Linux/macOS 환경의 루트 디렉토리 아래를, 
# Windows 환경에서는 드라이브의 루트 디렉토리 아래를 가리킵니다.
UPLOAD_FOLDER = './uploaded_img'
# 허용할 이미지 확장자 설정
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
# Flask 설정에 업로드 폴더 경로를 지정
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 확장자 검사 함수
def allowed_file(filename):
    """파일 이름의 확장자가 허용된 목록에 있는지 확인합니다."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload-image', methods=['POST'])
def upload_image():
    """클라이언트로부터 이미지 파일을 받아 저장하는 엔드포인트입니다."""
    
    # 요청에 'file' 필드가 포함되어 있는지 확인합니다.
    if 'file' not in request.files:
        return jsonify({'message': 'No file part (파일 필드가 없습니다)'}), 400
    
    file = request.files['file']
    
    # 파일 이름이 비어 있는지 확인합니다.
    if file.filename == '':
        return jsonify({'message': 'No selected file (선택된 파일이 없습니다)'}), 400
    
    # 파일이 존재하고 허용된 확장자인지 확인합니다.
    if file and allowed_file(file.filename):
        # 파일명 보안 처리 (경로 인젝션 방지)
        filename = secure_filename(file.filename)
        
        # 업로드 폴더가 없으면 생성합니다. (권한 문제가 발생할 수 있습니다.)
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            # 파일 저장을 시도하기 전에 디렉토리를 생성합니다.
            try:
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            except OSError as e:
                return jsonify({'message': f'Directory creation failed (디렉토리 생성 실패): {e}'}), 500
            
        # 파일을 설정된 업로드 폴더에 저장합니다.
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            file.save(save_path)
        except Exception as e:
            return jsonify({'message': f'File save failed (파일 저장 실패): {e}'}), 500
        
        return jsonify({'message': 'Image uploaded successfully (이미지 업로드 성공)', 'filename': filename, 'save_path': save_path}), 200
    else:
        return jsonify({'message': 'File type not allowed (허용되지 않은 파일 형식)'}), 400

if __name__ == '__main__':
    # Flask 앱 실행 (디버그 모드)
    print(f"Flask 서버를 http://127.0.0.1:5000 에서 실행합니다. 업로드 대상 폴더: {UPLOAD_FOLDER}")
    app.run(debug=True, port=5000)