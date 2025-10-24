import os
import uuid
import openai
from config import ALLOWED_EXTENSIONS, OPENAI_API_KEY

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

def analyze_prediction_with_openai(prediction_result, animal_type):
    """
    AI 모델의 예측 결과를 OpenAI API를 사용하여 분석합니다.
    """
    if not OPENAI_API_KEY:
        return {"error": "OpenAI API key not configured.", "analysis": ""}

    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    predicted_emotion = prediction_result.get("predicted_emotion", "N/A")
    confidence = prediction_result.get("confidence", 0.0)
    all_predictions = prediction_result.get("all_predictions", {})

    # 모든 예측 확률을 보기 좋게 포맷팅
    predictions_str = ", ".join([f"{k}: {v:.2f}" for k, v in all_predictions.items()])

    prompt = f"""
    다음은 {animal_type}의 감정 예측 결과입니다:
    예측된 감정: {predicted_emotion}
    신뢰도: {confidence:.2f}
    모든 감정 예측 확률: {predictions_str}

    이 {animal_type}의 감정 예측 결과에 대해 자세히 분석하고 설명해주세요. 
    특히, 예측된 감정이 무엇을 의미하는지, 신뢰도가 높은지 낮은지에 따라 어떤 해석을 할 수 있는지, 
    그리고 다른 감정들의 확률은 어떤 의미를 가지는지 설명해주세요. 
    결과는 한국어로 3~4문장으로 요약해주세요.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # 또는 "gpt-3.5-turbo" 등 사용 가능한 모델
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes animal emotion predictions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300
        )
        analysis = response.choices[0].message.content.strip()
        return {"analysis": analysis}
    except openai.APIError as e:
        print(f"OpenAI API Error: {e}")
        return {"error": f"OpenAI API Error: {e}", "analysis": ""}
    except Exception as e:
        print(f"An unexpected error occurred with OpenAI API: {e}")
        return {"error": f"Failed to get analysis from OpenAI: {e}", "analysis": ""}
