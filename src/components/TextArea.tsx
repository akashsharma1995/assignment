import { useState, useRef, useEffect, ReactElement, FC } from "react";

interface Props {
  value: string;
  handleChange: (e: any) => void;
}

const TextArea: FC<Props> = ({ value, handleChange }): ReactElement => {
  const [lineCount, setLineCount] = useState<string>("1");
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const lineCounterRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    handleLineCounter(value);
  }, [value]);

  useEffect(() => {
    const handleScroll = () => {
      if (lineCounterRef.current && codeEditorRef.current) {
        lineCounterRef.current.scrollTop = codeEditorRef.current.scrollTop;
        lineCounterRef.current.scrollLeft = codeEditorRef.current.scrollLeft;
      }
    };
    codeEditorRef?.current?.addEventListener("scroll", handleScroll);
    return () => {
      codeEditorRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLineCounter = (enteredText: string) => {
    const currentLineCount = enteredText.split(/\r?\n/).length;
    var countArr = new Array();
    const count = +lineCount.charAt(lineCount.length -1);
    if (count !== currentLineCount) {
      for (let i = 0; i < currentLineCount; i++) {
        countArr[i] = i + 1;
      }
      setLineCount(countArr.join("\n"));
    }
  };

  return (
    <div className=" bg-slate-950 rounded-md relative py-4">
      <textarea
        ref={lineCounterRef}
        wrap="off"
        readOnly
        className="m-0 p-2 h-[200px] resize-none leading-tight outline-none focus-visible:outline-none flex absolute border-transparent text-right text-slate-400 bg-slate-950 w-14 overflow-y-hidden border-r border-white font-semibold font-mono"
        value={lineCount}
      ></textarea>
      <textarea
        ref={codeEditorRef}
        wrap="off"
        value={value}
        className="m-0 p-2 h-[200px] resize-none leading-tight outline-none focus-visible:outline-none pl-16 w-full bg-slate-950 text-white border-slate-950 font-semibold"
        onInput={handleChange}
      ></textarea>
    </div>
  );
};

export default TextArea;
