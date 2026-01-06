import Hello from "./components/Hello.jsx";
import Greet from "./components/Greet.jsx";

export default function App() {
    // return <Greet name="shpark" />;

    return (
        <>
            <h1>App</h1>
            <Hello />
            <Greet name="shpark" />
        </>
    );
}
