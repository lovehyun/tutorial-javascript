// /login  -------->  LoginPage   (pages)
//                       |
//                       v
//                  LoginForm     (components)
//                       |
//                       v
//                   TextInput    (components)

import LoginPage from './pages/LoginPage.jsx';

export default function App() {
    return <LoginPage />;
}


// src/
//  ├─ pages/
//  │   ├─ LoginPage.jsx
//  │   └─ PostWritePage.jsx
//  │
//  └─ components/
//      ├─ LoginForm.jsx
//      ├─ TextInput.jsx
//      └─ Button.jsx


// src/
//  ├─ pages/
//  │   ├─ LoginPage.jsx
//  │   ├─ SignupPage.jsx
//  │   └─ PostWritePage.jsx
//  │
//  ├─ components/
//  │   ├─ forms/
//  │   │   ├─ LoginForm.jsx
//  │   │   └─ PostForm.jsx
//  │   │
//  │   ├─ inputs/
//  │   │   └─ TextInput.jsx
//  │   │
//  │   └─ common/
//  │       ├─ Button.jsx
//  │       └─ Modal.jsx
