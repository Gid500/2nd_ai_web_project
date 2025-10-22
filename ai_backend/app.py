from flask import Flask, send_from_directory
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from routes import upload_bp

def create_app():
    """
    Flask 애플리케이션 인스턴스를 생성하고 초기 설정합니다.
    """
    app = Flask(__name__)

    # config.py에서 정의된 설정 값을 Flask 설정에 적용합니다.
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['ALLOWED_EXTENSIONS'] = ALLOWED_EXTENSIONS

    # 라우팅 로직이 포함된 블루프린트(routes.py의 upload_bp)를 등록합니다.
    app.register_blueprint(upload_bp)

    # 업로드된 파일을 제공하는 정적 라우트 추가
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

# 애플리케이션 인스턴스를 생성합니다.
app = create_app()

if __name__ == '__main__':
    # Flask 앱 실행 (디버그 모드)
    print(f"Flask 서버를 http://127.0.0.1:5000 에서 실행합니다.")
    print(f"업로드 대상 폴더: {UPLOAD_FOLDER}")
    # app.run()을 사용하여 서버를 실행합니다.
    app.run(debug=True, port=5000)