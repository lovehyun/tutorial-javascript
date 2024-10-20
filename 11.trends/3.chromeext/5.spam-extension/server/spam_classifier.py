import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np

# 스팸 필터 모델을 학습하고 모델을 파일로 저장하는 함수
def train_spam_filter():
    # 간단한 학습 데이터 (스팸: 1, 정상: 0)
    data = [
        ('Get free money now', 1),  # Spam
        ('Meeting at 10 AM', 0),  # Not spam
        ('Earn money easily', 1),  # Spam
        ('Dinner with friends', 0),  # Not spam
        ('Claim your free prize', 1),  # Spam
        ('Project deadline next week', 0)  # Not spam
    ]

    # 이메일과 레이블을 분리
    emails, labels = zip(*data)

    # 텍스트 데이터를 벡터로 변환 (피처 추출)
    vectorizer = CountVectorizer()
    features = vectorizer.fit_transform(emails)

    # 나이브 베이즈 모델 학습
    model = MultinomialNB()
    model.fit(features, labels)

    # 모델과 벡터라이저를 파일로 저장
    with open('spam_filter_model.pkl', 'wb') as f:
        pickle.dump((model, vectorizer), f)

    print("Model and vectorizer saved to 'spam_filter_model.pkl'.")

# 학습된 모델을 불러오는 함수
def load_model():
    with open('spam_filter_model.pkl', 'rb') as f:
        model, vectorizer = pickle.load(f)

    print("Loading model into memory...")
    return model, vectorizer

# 저장된 모델 파일을 불러와 새로운 이메일을 예측하는 함수
def predict(email_content, model, vectorizer):
    # 입력된 이메일을 벡터화
    features = vectorizer.transform([email_content])

    # 스팸 여부 예측 (0: 정상, 1: 스팸)
    prediction = model.predict(features)[0]
    
    return prediction

# 스팸 확률을 출력하는 함수
def predict_proba(email_content, model, vectorizer):
    # 이메일을 벡터화하고 확률 예측
    features = vectorizer.transform([email_content])
    proba = model.predict_proba(features)[0]  # 스팸 확률과 정상 확률

    return {"spam": round(proba[1], 3), "not_spam": round(proba[0], 3)}

if __name__ == '__main__':
    # 이 파일을 직접 실행할 때만 모델 학습을 진행
    train_spam_filter()
