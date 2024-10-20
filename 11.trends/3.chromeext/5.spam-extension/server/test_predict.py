import subprocess
import json

# 테스트할 이메일 콘텐츠 리스트
test_emails = [
    "Get free money now",  # Spam
    "Meeting at 10 AM tomorrow",  # Not spam
    "Earn money easily and quickly",  # Spam
    "Please reach out if you have any questions",  # Not spam
    "Claim your 100% free coupon now",  # Spam
    "We need your account information",  # Spam
    "Your salary has been credited",  # Not spam
    "Huge discount on our products"  # Spam
]

# 서버 URL
url = "http://127.0.0.1:5000/spam-check"

def send_email_for_spam_check(email_content):
    # JSON 데이터를 curl을 통해 보내는 부분
    payload = json.dumps({"emailContent": email_content})
    
    # curl 명령어를 subprocess로 호출
    command = [
        'curl',
        '-X', 'POST',
        url,
        '-H', 'Content-Type: application/json',
        '-d', payload
    ]
    
    # 결과 실행 및 출력
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # 결과 출력
    return result.stdout.decode('utf-8')

# 테스트 수행
if __name__ == "__main__":
    for email in test_emails:
        print(f"Testing email content: {email}")
        response = send_email_for_spam_check(email)
        print(f"Response: {response}")
        print("-" * 40)
