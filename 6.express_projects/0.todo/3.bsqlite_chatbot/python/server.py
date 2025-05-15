# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d '{"question": "Please add a new task", "todos": []}'
# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d "{\"question\":\"Add meeting preparation\",\"todos\":[{\"text\":\"Meeting preparation\",\"completed\":false}]}"

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# Flask 앱 초기화
app = Flask(__name__)
CORS(app)  # CORS 허용 (다른 포트에서 요청 가능하도록)

# OpenAI API 클라이언트
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get("question")
    todos = data.get("todos", [])  # [{ "text": ..., "completed": true/false }, ...]

    print("수신된 질문:", question)
    print("현재 할 일 목록:", todos)
    
    if not question:
        return jsonify({ "error": "질문이 없습니다." }), 400

    # 할 일 목록을 문자열로 구성
    todo_list = "\n".join(
        [f"{i + 1}. {t['text']} [{'완료됨' if t['completed'] else '미완료'}]" for i, t in enumerate(todos)]
    ) or "할 일이 없습니다."

    # 시스템 프롬프트 생성
    system_prompt = f"""
당신은 To-Do 목록을 도와주는 비서입니다. 사용자의 질문을 이해하고 아래 예시처럼 반드시 JSON만 반환하세요.

[할 일 목록]
{todo_list}

[출력 형식]
{{ "action": "add" | "done" | "delete" | "list" | "summary", "text": "내용" }}

[예시]
질문: "회의 준비 추가해줘"
응답: {{ "action": "add", "text": "회의 준비" }}

질문: "완료한 일 요약해줘"
응답: {{ "action": "summary", "text": "" }}

※ 반드시 JSON 형식만 출력하고 마크다운, 설명, 코드블록(```json 등)은 절대 사용하지 마세요.
"""

    print("\n시스템 프롬프트:\n", system_prompt.strip())
    print("\n사용자 질문:\n", question)
    
    try:
        # OpenAI GPT 호출
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                { "role": "system", "content": system_prompt },
                { "role": "user", "content": question }
            ],
            temperature=0.2
        )

        # GPT 응답 정리
        reply = response.choices[0].message.content.strip()
        print("\nGPT 응답 원문:\n", reply)
        
        reply = reply.replace("```json", "").replace("```", "").strip()

        # JSON 파싱
        parsed = json.loads(reply)
        print("\n파싱된 응답 JSON:\n", parsed)

        return jsonify(parsed)

    except json.JSONDecodeError as e:
        print("JSON 파싱 실패:", e)
        return jsonify({ "error": "GPT 응답을 JSON으로 파싱할 수 없습니다.", "raw": reply }), 500

    except Exception as e:
        print("서버 오류:", e)
        return jsonify({ "error": "서버 내부 오류입니다." }), 500

@app.route("/chat/text2sql", methods=["POST"])
def text2sql():
    data = request.get_json()
    question = data.get("question")
    schema = data.get("schema")

    if not question or not schema:
        return jsonify({"error": "질문 또는 스키마가 누락되었습니다."}), 400

    system_prompt = f"""
당신은 SQLite 데이터베이스에 대한 SQL 생성기입니다.

[제공된 스키마]
{schema}

아래와 같은 사용자 질문에 대해 적절한 SQL 쿼리를 생성하세요. 반드시 JSON 형식으로만 응답하세요:

형식:
{{ "sql": "SELECT ...", "explanation": "이 쿼리는 ..." }}

주의사항:
- DROP, ALTER, CREATE 등 파괴적인 명령은 절대 생성하지 마세요.
- 항상 SELECT, INSERT, UPDATE, DELETE로 제한하세요.
- 마크다운, 코드 블록, 주석 없이 JSON만 반환하세요.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                { "role": "system", "content": system_prompt },
                { "role": "user", "content": question }
            ],
            temperature=0
        )

        reply = response.choices[0].message.content.strip()
        print("GPT 응답 원문:\n", reply)

        reply = reply.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(reply)
        return jsonify(parsed)

    except json.JSONDecodeError:
        return jsonify({"error": "GPT 응답을 JSON으로 파싱할 수 없습니다.", "raw": reply}), 500
    except Exception as e:
        return jsonify({"error": "서버 내부 오류", "message": str(e)}), 500

# Flask 서버 실행
if __name__ == '__main__':
    app.run(port=5000)
