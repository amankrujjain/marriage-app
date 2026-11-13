'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from '@tiptap/extension-table';
import { useEffect, useRef, useState } from 'react';
import { uploadAdminBlogImage } from '@/features/admin/services/adminApi';
import {
  BLOG_TABLE_PRESETS,
  buildSampleTableHtml,
  type BlogTablePresetId,
} from './tablePresets';

type EditorMode = 'visual' | 'html';

type BlogRichEditorProps = {
  html: string;
  json: unknown;
  disabled?: boolean;
  onChange: (html: string, json: unknown) => void;
};

const BlogTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'blog-table blog-table--plain',
        parseHTML: (element) =>
          element.getAttribute('class') || 'blog-table blog-table--plain',
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class as string };
        },
      },
    };
  },
});

export function BlogRichEditor({
  html,
  json,
  disabled,
  onChange,
}: BlogRichEditorProps) {
  const uploading = useRef(false);
  const [mode, setMode] = useState<EditorMode>('visual');
  const [htmlDraft, setHtmlDraft] = useState(html || '');
  const skipNextExternalSync = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your post…',
      }),
      BlogTable.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: (json as object | null) ?? html ?? '',
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      const nextHtml = ed.getHTML();
      skipNextExternalSync.current = true;
      setHtmlDraft(nextHtml);
      onChange(nextHtml, ed.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled && mode === 'visual');
  }, [editor, disabled, mode]);

  // Keep visual editor in sync when parent html changes (load / HTML apply).
  useEffect(() => {
    if (!editor || mode !== 'visual') return;
    if (skipNextExternalSync.current) {
      skipNextExternalSync.current = false;
      return;
    }
    const current = editor.getHTML();
    if ((html || '') === current) return;
    editor.commands.setContent(html || '', { emitUpdate: false });
    setHtmlDraft(html || '');
  }, [editor, html, mode]);

  function switchToHtml(): void {
    if (!editor || mode === 'html') return;
    const next = editor.getHTML();
    setHtmlDraft(next);
    setMode('html');
  }

  function switchToVisual(): void {
    if (!editor || mode === 'visual') return;
    editor.commands.setContent(htmlDraft || '', { emitUpdate: false });
    skipNextExternalSync.current = true;
    onChange(editor.getHTML(), editor.getJSON());
    setMode('visual');
  }

  function onHtmlChange(value: string): void {
    setHtmlDraft(value);
    onChange(value, null);
  }

  async function onPickImage() {
    if (!editor || uploading.current || mode !== 'visual') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      uploading.current = true;
      try {
        const result = await uploadAdminBlogImage(file);
        editor
          .chain()
          .focus()
          .setImage({ src: result.url, alt: file.name.replace(/\.[^.]+$/, '') })
          .run();
      } catch (err) {
        window.alert(err instanceof Error ? err.message : 'Image upload failed');
      } finally {
        uploading.current = false;
      }
    };
    input.click();
  }

  function onSetLink() {
    if (!editor || mode !== 'visual') return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const next = window.prompt('Link URL', prev ?? 'https://');
    if (next === null) return;
    if (next.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: next.trim() })
      .run();
  }

  function insertTablePreset(id: BlogTablePresetId): void {
    const preset = BLOG_TABLE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    const sample = buildSampleTableHtml(preset.className);

    if (mode === 'html') {
      const next = `${htmlDraft.trim()}\n${sample}`;
      setHtmlDraft(next);
      onChange(next, null);
      return;
    }
    if (!editor) return;
    editor.chain().focus().insertContent(sample).run();
  }

  function applyTableStyle(id: BlogTablePresetId): void {
    if (!editor || mode !== 'visual') return;
    const preset = BLOG_TABLE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    editor
      .chain()
      .focus()
      .updateAttributes('table', { class: preset.className })
      .run();
  }

  if (!editor) {
    return <p className="admin-muted">Loading editor…</p>;
  }

  const inTable = editor.isActive('table');

  return (
    <div className={`blog-editor${disabled ? ' is-disabled' : ''}`}>
      <div className="blog-editor-toolbar" role="toolbar" aria-label="Formatting">
        <div className="blog-editor-mode" role="group" aria-label="Editor mode">
          <button
            type="button"
            className={mode === 'visual' ? 'is-active' : ''}
            onClick={switchToVisual}
          >
            Visual
          </button>
          <button
            type="button"
            className={mode === 'html' ? 'is-active' : ''}
            onClick={switchToHtml}
          >
            {'</> HTML'}
          </button>
        </div>

        {mode === 'visual' ? (
          <>
            <button
              type="button"
              className={editor.isActive('bold') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              Bold
            </button>
            <button
              type="button"
              className={editor.isActive('italic') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              Italic
            </button>
            <button
              type="button"
              className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </button>
            <button
              type="button"
              className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              H3
            </button>
            <button
              type="button"
              className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
            >
              H4
            </button>
            <button
              type="button"
              className={editor.isActive('bulletList') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              Bullets
            </button>
            <button
              type="button"
              className={editor.isActive('orderedList') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              Numbered
            </button>
            <button type="button" onClick={onSetLink}>
              Link
            </button>
            <button type="button" onClick={() => void onPickImage()}>
              Image
            </button>
            <label className="blog-editor-table-select">
              <span className="sr-only">Insert table design</span>
              <select
                defaultValue=""
                disabled={Boolean(disabled)}
                onChange={(e) => {
                  const value = e.target.value as BlogTablePresetId | '';
                  e.target.value = '';
                  if (!value) return;
                  insertTablePreset(value);
                }}
              >
                <option value="" disabled>
                  Insert table…
                </option>
                {BLOG_TABLE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>
            {inTable ? (
              <>
                <label className="blog-editor-table-select">
                  <span className="sr-only">Table style</span>
                  <select
                    defaultValue=""
                    disabled={Boolean(disabled)}
                    onChange={(e) => {
                      const value = e.target.value as BlogTablePresetId | '';
                      e.target.value = '';
                      if (!value) return;
                      applyTableStyle(value);
                    }}
                  >
                    <option value="" disabled>
                      Table style…
                    </option>
                    {BLOG_TABLE_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  + Col
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  + Row
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                  − Col
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                >
                  − Row
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  Delete table
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
            >
              Redo
            </button>
          </>
        ) : (
          <label className="blog-editor-table-select">
            <span className="sr-only">Insert table HTML</span>
            <select
              defaultValue=""
              disabled={Boolean(disabled)}
              onChange={(e) => {
                const value = e.target.value as BlogTablePresetId | '';
                e.target.value = '';
                if (!value) return;
                insertTablePreset(value);
              }}
            >
              <option value="" disabled>
                Insert table HTML…
              </option>
              {BLOG_TABLE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {mode === 'visual' ? (
        <EditorContent editor={editor} className="blog-editor-content" />
      ) : (
        <textarea
          className="blog-editor-html"
          value={htmlDraft}
          disabled={disabled}
          spellCheck={false}
          aria-label="Post HTML"
          placeholder="Paste or edit HTML (tables, headings, links)…"
          onChange={(e) => onHtmlChange(e.target.value)}
        />
      )}
    </div>
  );
}
