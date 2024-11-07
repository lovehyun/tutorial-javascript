코드 설명

1. 기본 HTML 구조

doctype html: HTML5 문서를 선언합니다.
html, head, body 태그는 들여쓰기를 통해 중첩 구조로 작성합니다.

2. 속성 지정

meta(charset="UTF-8")처럼 소괄호 안에 속성을 지정합니다.
link(rel="stylesheet" href="/styles.css")를 통해 외부 CSS 파일을 연결합니다.

3. 텍스트 삽입

태그 이름 뒤에 바로 텍스트를 입력하면 해당 태그 내 텍스트가 삽입됩니다. 예: h1 제목: Pug 템플릿 예제

4. 조건문

if 구문을 통해 조건문을 사용할 수 있습니다.
#{user.name}와 같이 변수의 값을 삽입할 때 #{} 문법을 사용합니다.

5. 반복문

each 구문을 통해 반복문을 작성할 수 있습니다.
예제에서는 articles 배열의 각 요소를 반복하며 제목과 내용을 출력합니다.

6. 폼 요소

form 태그와 input, textarea, button 등을 사용하여 HTML 폼을 작성합니다.

7. 푸터

footer 태그로 푸터 영역을 추가합니다.
&copy;는 HTML의 특수 문자로, "©" 기호를 출력합니다.
