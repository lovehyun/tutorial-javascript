# 예제 1: 버튼 클릭으로 텍스트 변경
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 1</title>
</head>
<body>
    <p id="text">Hello, World!</p>
    <button id="changeTextButton">Change Text</button>
    <script src="example1.js"></script>
</body>
</html>
```
- JavaScript (example1.js):
```
document.getElementById("changeTextButton").addEventListener("click", function() {
    document.getElementById("text").innerText = "Text Changed!";
});
```

# 예제 2: 입력 값 표시
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 2</title>
</head>
<body>
    <input type="text" id="inputField" placeholder="Type something">
    <button id="displayButton">Display</button>
    <p id="displayText"></p>
    <script src="example2.js"></script>
</body>
</html>
```
- JavaScript (example2.js):
```
document.getElementById("displayButton").addEventListener("click", function() {
    const inputText = document.getElementById("inputField").value;
    document.getElementById("displayText").innerText = inputText;
});
```

# 예제 3: 색상 변경
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 3</title>
</head>
<body>
    <button id="colorButton">Change Color</button>
    <script src="example3.js"></script>
</body>
</html>
```

- JavaScript (example3.js):
```
document.getElementById("colorButton").addEventListener("click", function() {
    document.body.style.backgroundColor = "lightblue";
});
```

# 예제 4: 리스트 항목 추가
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 4</title>
</head>
<body>
    <ul id="itemList">
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>
    <input type="text" id="newItem" placeholder="New item">
    <button id="addItemButton">Add Item</button>
    <script src="example4.js"></script>
</body>
</html>
```
- JavaScript (example4.js):
```
document.getElementById("addItemButton").addEventListener("click", function() {
    const newItemText = document.getElementById("newItem").value;
    const newItem = document.createElement("li");
    newItem.innerText = newItemText;
    document.getElementById("itemList").appendChild(newItem);
});
```

# 예제 5: 요소 숨기기
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 5</title>
</head>
<body>
    <p id="hideText">This text will be hidden.</p>
    <button id="hideButton">Hide Text</button>
    <script src="example5.js"></script>
</body>
</html>
```
- JavaScript (example5.js):
```
document.getElementById("hideButton").addEventListener("click", function() {
    document.getElementById("hideText").style.display = "none";
});
```

# 예제 6: 클래스 토글링
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 6</title>
    <style>
        .highlight {
            background-color: yellow;
        }
    </style>
</head>
<body>
    <p id="toggleText">Toggle my highlight.</p>
    <button id="toggleButton">Toggle Highlight</button>
    <script src="example6.js"></script>
</body>
</html>
```
- JavaScript (example6.js):
```
document.getElementById("toggleButton").addEventListener("click", function() {
    document.getElementById("toggleText").classList.toggle("highlight");
});
```

# 예제 7: 이미지 변경
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 7</title>
</head>
<body>
    <img id="image" src="https://via.placeholder.com/150" alt="Placeholder Image">
    <button id="changeImageButton">Change Image</button>
    <script src="example7.js"></script>
</body>
</html>
```

- JavaScript (example7.js):
```
document.getElementById("changeImageButton").addEventListener("click", function() {
    document.getElementById("image").src = "https://via.placeholder.com/300";
});
```

# 예제 8: 요소 제거
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 8</title>
</head>
<body>
    <p id="removeText">This text will be removed.</p>
    <button id="removeButton">Remove Text</button>
    <script src="example8.js"></script>
</body>
</html>
```

- JavaScript (example8.js):
```
document.getElementById("removeButton").addEventListener("click", function() {
    const text = document.getElementById("removeText");
    text.parentNode.removeChild(text);
});
```

# 예제 9: 입력 필드 초기화
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 9</title>
</head>
<body>
    <input type="text" id="inputField" placeholder="Type something">
    <button id="clearButton">Clear Input</button>
    <script src="example9.js"></script>
</body>
</html>
```

- JavaScript (example9.js):
```
document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("inputField").value = "";
});
```

# 예제 10: 마우스 오버 효과
- HTML:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Example 10</title>
    <style>
        #hoverText {
            font-size: 20px;
        }
    </style>
</head>
<body>
    <p id="hoverText">Hover over me!</p>
    <script src="example10.js"></script>
</body>
</html>
```

- JavaScript (example10.js):
```
document.getElementById("hoverText").addEventListener("mouseover", function() {
    this.style.color = "red";
});
document.getElementById("hoverText").addEventListener("mouseout", function() {
    this.style.color = "black";
});
```
