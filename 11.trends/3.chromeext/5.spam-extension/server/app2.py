from flask import Flask, request, jsonify
from flask_cors import CORS
import spam_classifier2 as spam_classifier  # 미리 학습된 스팸 필터링 모델 로드

app = Flask(__name__)

# 모든 출처에서의 요청을 허용
CORS(app)

# 또는 특정 출처만 허용 (원하는 경우)
# CORS(app, origins=["chrome-extension://hblindnkppcmkdhhfkoanngichmghlhc"])

# 모델과 벡터라이저를 서버가 실행될 때 한 번 로드하여 메모리에 유지
model, vectorizer = spam_classifier.load_model()

@app.route('/spam-check', methods=['POST'])
def check_spam():
    data = request.get_json()
    email_content = data.get('emailContent')
    print("Received email content: ", email_content)

    # 스팸 여부 확인 (간단한 예시)
    # is_spam = "spam" in email_content.lower()
    # is_spam = "광고" in email_content

    # 스팸 여부 확인
    is_spam = spam_classifier.predict(email_content, model, vectorizer)
    # 스팸 확률 확인
    spam_prob = spam_classifier.predict_proba(email_content, model, vectorizer)
    
    # 분류에 기여한 주요 단어 확인
    important_words = spam_classifier.explain_prediction(email_content, model, vectorizer)

    print(f"Spam detection result: is_spam = {is_spam}, spam_probability = {spam_prob}, important_words = {important_words}")
    
    return jsonify({
        "is_spam": int(is_spam), 
        "spam_probability": spam_prob, 
        "important_words": important_words
    })

if __name__ == '__main__':
    app.run(debug=True)
