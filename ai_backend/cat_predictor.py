import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Define constants
IMAGE_WIDTH, IMAGE_HEIGHT = 224, 224

# Define model path
# CAT_MODEL_PATH = "/home/qod110/Documents/Project/2nd_ai_web_project/ai_model/cat_emotion_mobilenet_v2_v1_test.h5"
CAT_MODEL_PATH = "C:/Users/admin/Desktop/project/ai_model/cat_emotion_mobilenet_v2_v1_test.h5"

# Define class labels for the cat model
CAT_CLASS_LABELS = ['Angry', 'Disgusted', 'Happy', 'Normal', 'Sad', 'Scared', 'Surprised']

# Load the model once when the module is imported
try:
    cat_model = tf.keras.models.load_model(CAT_MODEL_PATH)
    print(f"AI cat model loaded successfully from {CAT_MODEL_PATH}")
except Exception as e:
    cat_model = None
    print(f"Error loading AI cat model: {e}")


def preprocess_image(image_input):
    """
    이미지 파일 경로 또는 파일 객체를 받아 모델 예측을 위해 전처리합니다.
    """
    if isinstance(image_input, str):
        # 파일 경로인 경우
        img = Image.open(image_input).convert('RGB')
    else:
        # 파일 객체인 경우 (예: Flask request.files)
        # FileStorage 객체의 stream을 Image.open에 전달
        img = Image.open(image_input.stream).convert('RGB') # .stream 추가
        
    img = img.resize((IMAGE_WIDTH, IMAGE_HEIGHT))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)  # 배치 차원 추가
    img_array = img_array / 255.0  # 정규화
    return img_array


def predict_cat_emotion(image_input):
    """
    고양이 이미지 경로 또는 파일 객체를 받아 감정을 예측하고 결과를 반환합니다.
    """
    if cat_model is None:
        return {"error": "AI cat model not loaded."}

    try:
        processed_image = preprocess_image(image_input)
        predictions = cat_model.predict(processed_image)

        # 예측 결과 유효성 검사
        if predictions is None or len(predictions) == 0 or predictions[0].size == 0:
            return {"error": "Prediction failed: Invalid prediction result from model."}
        
        # 가장 높은 확률을 가진 클래스 인덱스 찾기
        predicted_class_index = np.argmax(predictions[0])
        predicted_emotion = CAT_CLASS_LABELS[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index])

        return {
            "predicted_emotion": predicted_emotion,
            "confidence": confidence,
            "all_predictions": {label: float(pred) for label, pred in zip(CAT_CLASS_LABELS, predictions[0])}
        }
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}


if __name__ == '__main__':
    # 테스트를 위한 예제 이미지 경로 (실제 이미지 경로로 변경 필요)
    test_cat_image_path = (
        "/home/qod120/Documents/project/2nd_ai_web_project/ai_backend/uploaded_img/test_cat.jpg"
    )

    if os.path.exists(test_cat_image_path):
        print(f"Testing cat prediction with {test_cat_image_path}...")
        result = predict_cat_emotion(test_cat_image_path)
        print(result)
    else:
        print(f"Test cat image not found at {test_cat_image_path}. "
              "Please place a test image there to run the test.")
