"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
import { useEffect, useCallback } from "react";
import {
  Bold, Italic, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon,
  Undo, Redo, Minus,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-white text-black"
          : "text-neutral-400 hover:text-white hover:bg-white/10"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Mulai menulis konten artikel...",
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // use separate extension
        heading: { levels: [2, 3] },
      }),
      CodeBlock,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-400 underline underline-offset-2" },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[400px] focus:outline-none " +
          "prose-headings:text-white/90 prose-headings:font-semibold prose-headings:tracking-tight " +
          "prose-p:text-neutral-300 prose-p:leading-relaxed " +
          "prose-strong:text-white prose-em:text-neutral-300 " +
          "prose-code:text-green-400 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none " +
          "prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl " +
          "prose-blockquote:border-l-white/20 prose-blockquote:text-neutral-400 " +
          "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline " +
          "prose-li:text-neutral-300 prose-ul:text-neutral-300 prose-ol:text-neutral-300",
      },
    },
  });

  // Sync external content changes (e.g. when loading existing post)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current && content !== undefined) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL link:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/8 flex-wrap">
        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Inline marks */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <span className="text-[11px] font-mono font-bold px-0.5">{"</>"}</span>
        </ToolbarButton>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon size={15} />
        </ToolbarButton>

        {/* Horizontal rule */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={15} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="px-5 py-4">
        <EditorContent editor={editor} />
      </div>

      {/* Placeholder CSS */}
      <style>{`
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #525252;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
