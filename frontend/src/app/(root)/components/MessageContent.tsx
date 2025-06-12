// components/MessageRenderer.tsx
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { Components } from "react-markdown";

interface MessageRendererProps {
    content: string;
}

export function MessageRenderer({ content }: MessageRendererProps) {
    const components: Components = {
        code(props) {
            const { className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isInline = !className;

            if (!isInline && language) {
                return (
                    <SyntaxHighlighter
                        style={oneDark}
                        language={language}
                        PreTag="div"
                        className="rounded-md !mt-2 !mb-2"
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                );
            }

            return (
                <code
                    className="bg-gray-700 text-gray-100 px-1.5 py-0.5 rounded text-sm"
                    {...rest}
                >
                    {children}
                </code>
            );
        },
        p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
        },
        ul({ children }) {
            return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
        },
        ol({ children }) {
            return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
        },
        blockquote({ children }) {
            return (
                <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2">
                    {children}
                </blockquote>
            );
        },
    };

    return (
        <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
    );
}