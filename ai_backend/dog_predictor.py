import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Define constants
IMAGE_WIDTH, IMAGE_HEIGHT = 128, 128

# Define model path
DOG_MODEL_PATH = "ai_model/dog_emotion_mobilenet_finetuned_v2.h5c"
# DOG_MODEL_PATH = "C:/Users/admin/Desktop/project/ai_model/dog_emotion_mobilenet_finetuned_v2.h5"

# Define class labels for the dog model
DOG_CLASS_LABELS = ['Happy', 'Sad', 'Angry', 'Relaxed', 'Scared', 'Neutral']

# Load the model once when the module is imported
try:
    dog_model = tf.keras.models.load_model(DOG_MODEL_PATH)
    print(f"AI dog model loaded successfully from {DOG_MODEL_PATH}")
except Exception as e:
    dog_model = None
    print(f"Error loading AI dog model: {e}")


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

def predict_dog_emotion(image_input):
    """
    강아지 이미지 경로 또는 파일 객체를 받아 감정을 예측하고 결과를 반환합니다.
    """
    if dog_model is None:
        return {"error": "AI dog model not loaded."}

    try:
        processed_image = preprocess_image(image_input)
        predictions = dog_model.predict(processed_image)
        
        # 예측 결과에서 가장 높은 확률을 가진 클래스 인덱스를 찾습니다.
        predicted_class_idx = np.argmax(predictions[0])
        predicted_emotion = DOG_CLASS_LABELS[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])

        return {
            "predicted_emotion": predicted_emotion,
            "confidence": confidence,
            "all_predictions": {label: float(pred) for label, pred in zip(DOG_CLASS_LABELS, predictions[0])}
        }
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}


if __name__ == '__main__':
    # 테스트를 위한 예제 이미지 경로 (실제 이미지 경로로 변경 필요)
    test_dog_image_path = (
        "/home/qod120/Documents/project/2nd_ai_web_project/ai_backend/uploaded_img/test_dog.jpg"
    )

    if os.path.exists(test_dog_image_path):
        print(f"Testing dog prediction with {test_dog_image_path}...")
        result = predict_dog_emotion(test_dog_image_path)
        print(result)
    else:
        print(f"Test dog image not found at {test_dog_image_path}. "
              "Please place a test image there to run the test.")