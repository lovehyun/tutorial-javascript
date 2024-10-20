import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np

# 스팸 필터 모델을 학습하고 모델을 파일로 저장하는 함수
def train_spam_filter():
    # 이메일과 라벨을 하나로 합침 (튜플 리스트 형식)
    data = [
        ('Get free money now', 1),  # Spam
        ('Meeting at 10 AM tomorrow', 0),  # Not spam
        ('Earn money easily and quickly', 1),  # Spam
        ('Let\'s meet for dinner tonight', 0),  # Not spam
        ('Claim your 100% free coupon now', 1),  # Spam
        ('We need your account information', 1),  # Spam
        ('Please check your payroll for this month', 0),  # Not spam
        ('Huge discount on our products', 1),  # Spam
        ('Project deadline next week', 0),  # Not spam
        ('Please reach out if you have any questions', 0),  # Not spam
        ('This product is absolutely free', 1),  # Spam
        ('Request to cancel my subscription', 0),  # Not spam
        ('Your account has been hacked', 1),  # Spam
        ('Your salary has been credited', 0)  # Not spam
    ]

    # 이메일과 레이블을 분리
    emails = [email for email, label in data]
    labels = [label for email, label in data]

    # TF-IDF 벡터라이저 사용
    # vectorizer = TfidfVectorizer()

    # TF-IDF 벡터라이저 사용 (n-gram 적용) - 정확도를 높이기 위해 단어보다 단어간의 관계를 학습
    vectorizer = TfidfVectorizer(ngram_range=(2, 3))  # 2-gram과 3-gram 적용

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
    
    # proba = model.predict_proba(features)[0]  # [정상 확률, 스팸 확률]

    # # 스팸 확률이 70% 이상일 때만 스팸으로 판단
    # if proba[1] >= 0.7:
    #     return 1  # 스팸
    # else:
    #     return 0  # 정상
    
    return prediction

# 이메일이 스팸일 확률을 반환하는 함수
def predict_proba(email_content, model, vectorizer):
    # 입력된 이메일을 벡터화
    features = vectorizer.transform([email_content])
    
    # 각 클래스에 속할 확률 예측
    proba = model.predict_proba(features)[0]  # [스팸 확률, 정상 확률]
    
    # 확률 값을 소수점 셋째 자리까지 반올림하여 반환
    return {"spam": round(proba[1], 3), "not_spam": round(proba[0], 3)}

# 각 단어의 로그 우도 비율을 확인하여 스팸 분류에 기여한 단어를 반환하는 함수
def explain_prediction(email_content, model, vectorizer):
    # 입력된 이메일을 벡터화
    features = vectorizer.transform([email_content])

    # 피처 이름(단어) 추출
    feature_names = vectorizer.get_feature_names_out()

    # 각 클래스에 대한 로그 우도 비율
    log_probs = model.feature_log_prob_  # 스팸과 정상 클래스 각각에 대한 로그 확률

    # 스팸 클래스에 대한 로그 확률(log probabilities)을 사용
    spam_class_log_probs = log_probs[1]  # 클래스 1 (스팸)의 로그 확율

    # 이메일에 포함된 단어의 인덱스 추출 (벡터화된 데이터에서 사용된 단어만 추출)
    email_indices = features.nonzero()[1]  # 0번째는 문서 인덱스, 1번째는 단어 인덱스

    # 이메일 내용에 포함된 단어의 로그 확률을 추출
    important_words = []
    for idx in email_indices:
        word = feature_names[idx]
        log_prob = spam_class_log_probs[idx]
        # 로그 확률을 지수로 변환하여 확률로 해석할 수 있게 변경
        important_words.append((word, np.exp(log_prob)))

    # 로그 확률이 큰 순서로 정렬
    important_words = sorted(important_words, key=lambda x: x[1], reverse=True)

    return important_words[:5]  # 중요한 단어 5개 반환

if __name__ == '__main__':
    # 이 파일을 직접 실행할 때만 모델 학습을 진행
    train_spam_filter()
