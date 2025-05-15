# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d '{"question": "Please add a new task", "todos": []}'
# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d "{\"question\":\"Add meeting preparation\",\"todos\":[{\"text\":\"Meeting preparation\",\"completed\":false}]}"

# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d '{"question": "파이썬 숙제 추가해줘", "todos": [], "session_id": "user123"}'
# curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d '{"question": "숙제 다했어", "todos": [{"text": "파이썬 숙제", "completed": false}], "session_id": "user123"}'

# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableSequence
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

# 환경변수 로드
load_dotenv()

# Flask 초기화
app = Flask(__name__)
CORS(app)

# LangChain LLM 구성
llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

# 파서
json_parser = JsonOutputParser()

# 세션별 히스토리 저장소
memory_store = {}

def get_memory(session_id: str):
    if session_id not in memory_store:
        memory_store[session_id] = ChatMessageHistory()
    return memory_store[session_id]

def build_memory_chain(base_chain, session_id):
    memory = get_memory(session_id)
    return RunnableWithMessageHistory(
        base_chain,
        lambda session_id=session_id: memory,
        input_messages_key="question",
        history_messages_key="history"
    )


# To-Do 챗봇 체인 구성
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
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}")
    ])

    return prompt | llm | json_parser


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get("question")
    todos = data.get("todos", [])
    session_id = data.get("session_id", "default")  # 기본 세션 ID

    print("세션 ID:", session_id)
    print("수신된 질문:", question)
    print("현재 할 일 목록:", todos)
    
    if not question:
        return jsonify({ "error": "질문이 없습니다." }), 400

    try:
        base_chain = get_todo_chain(todos)
        memory_chain = build_memory_chain(base_chain, session_id)
        result = memory_chain.invoke({ "question": question }, config={"configurable": {"session_id": session_id}})
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

아래와 같은 사용자 질문에 대해 적절한 SQL 쿼리를 생성하세요. 반드시 JSON 형식으로만 응답하세요.
만약 쿼리문을 생성할 수 없는 질문을 받게 되면 sql은 빈 값으로, explanation 필드에 사용자에게 전달할 질문에 대한 답변을 작성하세요.

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
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}")
    ])

    return prompt | llm | json_parser


@app.route("/chat/text2sql", methods=["POST"])
def text2sql():
    data = request.get_json()
    question = data.get("question")
    schema = data.get("schema")
    session_id = data.get("session_id", "default")

    print("세션 ID:", session_id)
    print("수신된 질문:", question)
    print("현재 스키마 목록:", schema)

    if not question or not schema:
        return jsonify({"error": "질문 또는 스키마가 누락되었습니다."}), 400

    try:
        base_chain = get_sql_chain(schema)
        memory_chain = build_memory_chain(base_chain, session_id)
        result = memory_chain.invoke({ "question": question }, config={"configurable": {"session_id": session_id}})
        print("\nGPT 응답 원문:\n", result)
        return jsonify(result)

    except Exception as e:
        return jsonify({ "error": "SQL 처리 오류", "message": str(e) }), 500


# 서버 실행
if __name__ == "__main__":
    app.run(port=5000)
