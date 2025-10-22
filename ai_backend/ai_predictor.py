import tensorflow as tf
import numpy as np
from PIL import Image
import os
import pandas as pd

# Define constants - these should match the model's training
IMAGE_WIDTH, IMAGE_HEIGHT = 128, 128
MODEL_PATH = "/home/qod120/Documents/project/2nd_ai_web_project/ai_model/cat_emotion_mobilenet_finetuned_v1.h5"
CLASSES_CSV_PATH = "/home/qod120/Documents/project/2nd_ai_web_project/ai_model/Cat Emotions.v1i.multiclass/train/_classes.csv"

# Load the model once when the module is imported
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"AI model loaded successfully from {MODEL_PATH}")
except Exception as e:
    model = None
    print(f"Error loading AI model: {e}")

# Load class labels
class_labels = []
try:
    df_classes = pd.read_csv(CLASSES_CSV_PATH)
    # Assuming the class names are the column headers excluding 'filename'
    class_labels = df_classes.columns.drop('filename').tolist()
    print(f"Class labels loaded: {class_labels}")
except Exception as e:
    print(f"Error loading class labels from {CLASSES_CSV_PATH}: {e}")
    # Fallback labels if loading fails
    class_labels = ['Angry', 'Happy', 'Neutral', 'Sad', 'Scared', 'Surprised', 'Unlabeled']


def preprocess_image(image_input):
    """
    이미지 파일 경로 또는 파일 객체를 받아 모델 예측을 위해 전처리합니다.
    """
    if isinstance(image_input, str):
        # 파일 경로인 경우
        img = Image.open(image_input).convert('RGB')
    else:
        # 파일 객체인 경우 (예: Flask request.files)
        img = Image.open(image_input).convert('RGB')
        
    img = img.resize((IMAGE_WIDTH, IMAGE_HEIGHT))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)  # 배치 차원 추가
    img_array = img_array / 255.0  # 정규화
    return img_array

def predict_image_emotion(image_input):
    """
    이미지 경로 또는 파일 객체를 받아 감정을 예측하고 결과를 반환합니다.
    """
    if model is None:
        return {"error": "AI model not loaded."}

    try:
        processed_image = preprocess_image(image_input)
        predictions = model.predict(processed_image)
        
        # 예측 결과에서 가장 높은 확률을 가진 클래스 인덱스를 찾습니다.
        predicted_class_idx = np.argmax(predictions[0])
        predicted_emotion = class_labels[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])

        return {
            "predicted_emotion": predicted_emotion,
            "confidence": confidence,
            "all_predictions": {label: float(pred) for label, pred in zip(class_labels, predictions[0])}
        }
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}

if __name__ == '__main__':
    # 테스트를 위한 예제 이미지 경로 (실제 이미지 경로로 변경 필요)
    test_image_path = "/home/qod120/Documents/project/2nd_ai_web_project/ai_backend/uploaded_img/test_cat.jpg" 
    # 이 경로에 테스트 이미지를 넣어주세요.

    if os.path.exists(test_image_path):
        print(f"Testing prediction with {test_image_path}...")
        result = predict_image_emotion(test_image_path)
        print(result)
    else:
        print(f"Test image not found at {test_image_path}. Please place a test image there to run the test.")
