import {useCallback, useEffect, useMemo, useState} from 'react'
import './App.css'
import Editor from "./editor.jsx";
import Graph from "./graph.jsx";
import { Transformer } from "./lib.js";
import {LANGUAGES} from "./constants.js";

function App() {
    const [text, setText] = useState("");
    const [err, setErr] = useState(null);

    const handleEditorChange = useCallback((v, e) => setText(v), []);

    const transformer = useMemo(() => {
        try {
            return new Transformer(LANGUAGES.JSON, JSON.parse(text)).transform();
        } catch (err) {
            setErr(err)
        }
    }, [text]);

    const nodes = useMemo(() => transformer?transformer.getNodes():[], [text]);
    const links = useMemo(() => transformer?transformer.getLinks():[], [text]);


    useEffect(() => {
        if (!err) {
            console.log(err);
        }
    }, [err, text]);

    return (
        <main className={"main"}>
            <section className={'editor-container'}>
                <Editor
                    handleChange={handleEditorChange}
                    value={text}
                />
            </section>
            <section className={'screen-container'}>
                <Graph nodes={nodes} links={links} transformer={transformer} />
            </section>
        </main>
    )
}

export default App
