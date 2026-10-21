"use client";

import "@mantine/core/styles.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import * as React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

export interface BlockNoteEditorProps {
  initialMarkdown?: string;
  onChangeMarkdown?: (markdown: string) => void;
  editable?: boolean;
  className?: string;
}

export function BlockNoteEditor({
  initialMarkdown,
  onChangeMarkdown,
  editable = true,
  className = "",
}: BlockNoteEditorProps) {
  const [editorTheme, setEditorTheme] = React.useState<"light" | "dark">("dark");
  const isLoadedRef = React.useRef(false);

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setEditorTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const darkActive = document.documentElement.classList.contains("dark");
      setEditorTheme(darkActive ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const editor = useCreateBlockNote();

  React.useEffect(() => {
    async function loadInitial() {
      if (!isLoadedRef.current && initialMarkdown && initialMarkdown.trim().length > 0) {
        try {
          const blocks = await editor.tryParseMarkdownToBlocks(initialMarkdown);
          if (blocks && blocks.length > 0) {
            editor.replaceBlocks(editor.document, blocks);
          }
        } catch (e) {
          console.error("Failed to parse initial markdown for BlockNote:", e);
        }
        isLoadedRef.current = true;
      }
    }
    loadInitial();
  }, [editor, initialMarkdown]);

  const handleChange = React.useCallback(async () => {
    if (onChangeMarkdown) {
      try {
        const md = await editor.blocksToMarkdownLossy(editor.document);
        onChangeMarkdown(md);
      } catch (err) {
        console.error("Failed converting blocks to markdown:", err);
      }
    }
  }, [editor, onChangeMarkdown]);

  return (
    <div className={`bn-container min-h-[400px] w-full rounded-xl border border-border bg-card p-2 sm:p-4 shadow-sm ${className}`}>
      <BlockNoteView
        editor={editor}
        theme={editorTheme}
        editable={editable}
        onChange={handleChange}
      />
    </div>
  );
}

export default BlockNoteEditor;
