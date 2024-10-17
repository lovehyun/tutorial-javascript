from flask import Flask, request, jsonify
from flask_cors import CORS
import spam_classifier  # 미리 학습된 스팸 필터링 모델 로드

app = Flask(__name__)

# 모든 출처에서의 요청을 허용
CORS(app)

# 또는 특정 출처만 허용 (원하는 경우)
# CORS(app, origins=["chrome-extension://hblindnkppcmkdhhfkoanngichmghlhc"])

@app.route('/spam-check', methods=['POST'])
def check_spam():
    data = request.get_json()
    email_content = data.get('emailContent')
    print(email_content)
    
    # 스팸 여부 확인 (간단한 예시)
    # is_spam = "spam" in email_content.lower()
    is_spam = "광고" in email_content

    # 스팸 여부 확인
    # is_spam = spam_classifier.predict(email_content)

    print("스팸여부: ", is_spam)
    
    return jsonify({"is_spam": is_spam})

if __name__ == '__main__':
    app.run(debug=True)
