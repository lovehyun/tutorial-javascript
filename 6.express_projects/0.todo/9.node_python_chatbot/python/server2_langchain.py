# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d '{"question": "Please add a new task", "todos": []}'
# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d "{\"question\":\"Add meeting preparation\",\"todos\":[{\"text\":\"Meeting preparation\",\"completed\":false}]}"

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableSequence

# 환경변수 로드
load_dotenv()

# Flask 초기화
app = Flask(__name__)
CORS(app)

# LangChain LLM 구성
llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

# 공통 파서
json_parser = JsonOutputParser()

# To-Do 챗봇용 체인 구성
def get_todo_chain(todos):
    todo_list = "\n".join(
        [f"{i + 1}. {t['text']} [{'완료됨' if t['completed'] else '미완료'}]" for i, t in enumerate(todos)]
    ) or "할 일이 없습니다."

    system_prompt = f"""
당신은 To-Do 목록을 도와주는 비서입니다. 사용자의 질문을 이해하고 아래 예시처럼 반드시 JSON만 반환하세요.

[할 일 목록]
{todo_list}

[출력 형식]
{{{{ "action": "add" | "done" | "delete" | "list" | "summary", "text": "내용" }}}}

※ 반드시 JSON 형식만 출력하고 마크다운, 설명, 코드블록(```json 등)은 절대 사용하지 마세요.
"""

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{question}")
    ])

    chain = prompt | llm | json_parser
    return chain


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get("question")
    todos = data.get("todos", [])

    print("수신된 질문:", question)
    print("현재 할 일 목록:", todos)
    
    if not question:
        return jsonify({ "error": "질문이 없습니다." }), 400

    try:
        chain = get_todo_chain(todos)
        result = chain.invoke({ "question": question })
        print("\nGPT 응답 원문:\n", result)
        return jsonify(result)

    except Exception as e:
        return jsonify({ "error": "처리 중 오류 발생", "message": str(e) }), 500


# Text2SQL 체인 구성
def get_sql_chain(schema):
    system_prompt = f"""
당신은 SQLite 데이터베이스에 대한 SQL 생성기입니다.

[제공된 스키마]
{schema}

아래와 같은 사용자 질문에 대해 적절한 SQL 쿼리를 생성하세요. 반드시 JSON 형식으로만 응답하세요:

형식:
{{{{ "sql": "SELECT ...", "explanation": "이 쿼리는 ..." }}}}

제약 조건:
- 반드시 위에 제공된 스키마의 테이블과 필드만 사용하세요.
- 제공되지 않은 테이블이나 필드는 절대 사용하지 마세요.
- DROP, ALTER, CREATE 같은 파괴적인 명령은 절대 생성하지 마세요.
- SELECT, INSERT, UPDATE, DELETE만 사용하세요.
- 마크다운, 코드 블록, 주석 없이 JSON만 반환하세요.
"""

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{question}")
    ])

    chain = prompt | llm | json_parser
    return chain


@app.route("/chat/text2sql", methods=["POST"])
def text2sql():
    data = request.get_json()
    question = data.get("question")
    schema = data.get("schema")

    print("수신된 질문:", question)
    print("현재 스키마 목록:", schema)
    
    if not question or not schema:
        return jsonify({"error": "질문 또는 스키마가 누락되었습니다."}), 400

    try:
        chain = get_sql_chain(schema)
        result = chain.invoke({ "question": question })
        print("\nGPT 응답 원문:\n", result)
        return jsonify(result)

    except Exception as e:
        return jsonify({ "error": "SQL 처리 오류", "message": str(e) }), 500


# Flask 실행
if __name__ == "__main__":
    app.run(port=5000)
