from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# 예시 데이터로 스팸 모델을 학습시킵니다.
def train_spam_filter():
    emails = ['Free money now', 'Meeting at 10 AM', 'Earn money easily']
    labels = [1, 0, 1]  # 1 = 스팸, 0 = 정상

    vectorizer = CountVectorizer()
    features = vectorizer.fit_transform(emails)

    model = MultinomialNB()
    model.fit(features, labels)
    return model, vectorizer

model, vectorizer = train_spam_filter()

def predict(email_content):
    features = vectorizer.transform([email_content])
    return model.predict(features)[0]
