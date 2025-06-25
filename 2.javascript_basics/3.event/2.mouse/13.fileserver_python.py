from flask import Flask, request

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    files = request.files.getlist('files[]')
    for file in files:
        file.save(f'./uploads/{file.filename}')  # uploads 폴더에 저장
    return '파일 업로드 성공!'

if __name__ == '__main__':
    app.run(port=5000)
