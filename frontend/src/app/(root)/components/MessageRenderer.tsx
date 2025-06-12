// components/MessageRenderer.tsx
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

interface MessageRendererProps {
    content: string;
}

export function MessageRenderer({ content }: MessageRendererProps) {
    // Memoize components object to prevent recreation on every render
    const components: Components = useMemo(
        () => ({
            code(props) {
                const { className, children, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                const isInline = !className;

                if (!isInline && language) {
                    return (
                        <div className="my-3 rounded-lg overflow-hidden">
                            <div className="bg-[#362d3d] text-gray-300 px-3 py-2 text-xs font-mono border-b border-[#362d3d]">
                                {language}
                            </div>
                            <SyntaxHighlighter
                                style={oneDark}
                                language={language}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    fontSize: '13px',
                                    lineHeight: '1.4',
                                }}
                                showLineNumbers={false}
                                wrapLines={false}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>
                    );
                }

                return (
                    <code
                        className="bg-gray-700 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
                        {...rest}
                    >
                        {children}
                    </code>
                );
            },
            p({ children }) {
                return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
            },
            h1({ children }) {
                return <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>;
            },
            h2({ children }) {
                return <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>;
            },
            h3({ children }) {
                return <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>;
            },
            ul({ children }) {
                return <ul className="list-disc list-inside mb-3 space-y-1 ml-2">{children}</ul>;
            },
            ol({ children }) {
                return <ol className="list-decimal list-inside mb-3 space-y-1 ml-2">{children}</ol>;
            },
            li({ children }) {
                return <li className="leading-relaxed">{children}</li>;
            },
            strong({ children }) {
                return <strong className="font-semibold text-white">{children}</strong>;
            },
            blockquote({ children }) {
                return (
                    <blockquote className="border-l-4 border-gray-500 pl-4 italic my-3 text-gray-300">
                        {children}
                    </blockquote>
                );
            },
            a({ children, href }) {
                return (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        {children}
                    </a>
                );
            },
        }),
        []
    );

    // Memoize the entire rendered content
    const renderedContent = useMemo(() => (
        <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
    ), [content, components]);

    return renderedContent;
}