import "./App.css";
import { downloadZip } from "client-zip";
import FileSaver from "file-saver";

const tfs = String.raw`
str = str.replaceAll("\r", "\n"); // unify newline style
str = str.replaceAll(/[^\S\n]+/gm, " "); // collapse multiple whitespace
str = str.replaceAll(/ +,/g, ","); // remove whitespace preceding commas
str = str.replaceAll(/[“”]/g, '"'); // replace fancy doublequotes
str = str.replaceAll(/[‘’]/g, "'"); // replace fancy singlequotes
str = str.replaceAll("…", "..."); // replace fancy ellipses
str = str.replaceAll(/ +([,!])/g, "$1"); // remove whitespace preceding a comma or bang
str = str.replaceAll(/^ +([^ ])/gm, "$1"); // remove leading whitespace
str = str.replaceAll(/([^ ]) +$/gm, "$1"); // remove trailing whitespace
str = str.replace(/^\n+/, ""); // remove initial empty lines
str = str.replaceAll(/\n+/g, "\n"); // remove other empty lines
str = str.replaceAll(/^[^a-z0-9]+$/gm, "***"); // replace fully-non-alphanumeric lines with chapter breaks
`;

function App() {
  const processFiles = (files: FileList) => {
    const results: { name: string; input: string }[] = [];
    const processFiles: Promise<unknown>[] = [];
    Array.from(files).forEach((f) => {
      processFiles.push(
        f.text().then((text) => {
          let str = text;
          str = str.replaceAll("\r", "\n"); // unify newline style
          str = str.replaceAll(/[^\S\n]+/gm, " "); // collapse multiple whitespace
          str = str.replaceAll(/ +,/g, ","); // remove whitespace preceding commas
          str = str.replaceAll(/[“”]/g, '"'); // replace fancy doublequotes
          str = str.replaceAll(/[‘’]/g, "'"); // replace fancy singlequotes
          str = str.replaceAll("…", "..."); // replace fancy ellipses
          str = str.replaceAll(/ +([,!])/g, "$1"); // remove whitespace preceding a comma or bang
          str = str.replaceAll(/^ +([^ ])/gm, "$1"); // remove leading whitespace
          str = str.replaceAll(/([^ ]) +$/gm, "$1"); // remove trailing whitespace
          str = str.replace(/^\n+/, ""); // remove initial empty lines
          str = str.replaceAll(/\n+/g, "\n"); // remove other empty lines
          str = str.replaceAll(/^[^a-z0-9]+$/gm, "***"); // replace fully-non-alphanumeric lines with chapter breaks

          results.push({ name: f.name, input: str });
        })
      );
    });
    Promise.all(processFiles).then(() =>
      downloadZip(results)
        .blob()
        .then((blob) => {
          FileSaver.saveAs(blob, "processed.zip");
        })
    );
  };
  return (
    <div className="App" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <pre style={{ textAlign: "left", display: "block" }}>
        This tool reformats text for NovelAI module training, in your browser.
        <br />
        Transformations applied:
        <br />
        <br />
        {tfs}
      </pre>
      <p>Select files to process:</p>
      <input
        type="file"
        multiple={true}
        accept=".txt"
        onChange={(e) => processFiles(e.target.files!)}
      />
    </div>
  );
}

export default App;
