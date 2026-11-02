'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef } from 'react';
import { uploadAdminBlogImage } from '@/features/admin/services/adminApi';

type BlogRichEditorProps = {
  html: string;
  json: unknown;
  disabled?: boolean;
  onChange: (html: string, json: unknown) => void;
};

export function BlogRichEditor({
  html,
  json,
  disabled,
  onChange,
}: BlogRichEditorProps) {
  const uploading = useRef(false);

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
    ],
    content: (json as object | null) ?? html ?? '',
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML(), ed.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  async function onPickImage() {
    if (!editor || uploading.current) return;
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
    if (!editor) return;
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

  if (!editor) {
    return <p className="admin-muted">Loading editor…</p>;
  }

  return (
    <div className={`blog-editor${disabled ? ' is-disabled' : ''}`}>
      <div className="blog-editor-toolbar" role="toolbar" aria-label="Formatting">
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
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
      </div>
      <EditorContent editor={editor} className="blog-editor-content" />
    </div>
  );
}
