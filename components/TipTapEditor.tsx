'use client';

import React, { useState, useRef } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import OrderedList from '@tiptap/extension-ordered-list';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

// UI Components
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';

// Icons
import { 
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, ImageIcon, Table as TableIcon, 
  Palette, Highlighter, Heading1, Heading2, Quote, Link as LinkIcon, 
  Undo, Redo, Minus, Grid3X3, ArrowDownToLine, ArrowRightToLine, Trash2,
  UploadCloud, Check, Maximize, Minimize, AlignLeft as AlignLeftIcon, AlignRight as AlignRightIcon
} from 'lucide-react';

// ==============================================================
// 1. CUSTOM ROMAN NUMERAL LIST
// ==============================================================
const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      type: { default: '1', parseHTML: el => el.getAttribute('type'), renderHTML: attrs => ({ type: attrs.type }) },
    };
  },
});

// ==============================================================
// 2. DRAG-TO-RESIZE IMAGE COMPONENT (WORLD CLASS FEATURE)
// ==============================================================
const ResizableImageNode = ({ node, updateAttributes, selected }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.pageX;
    const startWidth = containerRef.current?.getBoundingClientRect().width || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.pageX;
      const newWidth = startWidth + (currentX - startX);
      updateAttributes({ width: `${Math.max(100, newWidth)}px` }); // Minimum width 100px
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const align = node.attrs.align;
  const alignClass = 
    align === 'left' ? 'float-left mr-6 mb-4' :
    align === 'right' ? 'float-right ml-6 mb-4' :
    'mx-auto block mb-4';

  return (
    <NodeViewWrapper className={`clear-none ${align === 'center' ? 'flex justify-center' : ''}`}>
      <div 
        ref={containerRef}
        className={`relative ${alignClass} group`}
        style={{ width: node.attrs.width || '100%', maxWidth: '100%' }}
        draggable="true"
        data-drag-handle
      >
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt || ''}
          className={`w-full h-auto rounded-lg m-0 transition-shadow ${selected ? 'ring-4 ring-primary ring-offset-2' : ''}`}
        />
        {/* Resize Handle (The small dot at the bottom right) */}
        {selected && (
          <div
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-primary border-2 border-white rounded-full cursor-se-resize z-50 hover:scale-125 transition-transform shadow-md"
            onMouseDown={handleMouseDown}
            title="Drag to resize"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { 
        default: '100%', 
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => ({ width: attributes.width }) 
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align'),
        renderHTML: attributes => ({ 'data-align': attributes.align })
      }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode);
  }
});

// ==============================================================
// 3. MAIN TIPTAP EDITOR COMPONENT
// ==============================================================
interface TipTapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function TipTapEditor({ content, onChange, onImageUpload }: TipTapEditorProps) {
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ orderedList: false }),
      CustomOrderedList,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CustomImage,
      Underline,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-6 bg-background custom-tiptap-styles',
      },
    },
  });

  if (!editor) return null;

  // Image Upload Logic
  const handleInsertImageUrl = () => {
    if (imageUrlInput.trim()) {
      editor.chain().focus().setImage({ src: imageUrlInput }).run();
      setImageUrlInput('');
      setIsImagePopoverOpen(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      setIsUploading(true);
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
        setIsImagePopoverOpen(false);
      } catch (error) {
        alert("Image upload failed.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Link Logic
  const handleInsertLink = () => {
    if (linkUrlInput === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrlInput }).run();
    }
    setLinkUrlInput('');
    setIsLinkPopoverOpen(false);
  };

  const insertGreek = (symbol: string) => editor.chain().focus().insertContent(symbol).run();
  const ToolbarSeparator = () => <div className="w-px h-6 bg-border mx-1" />;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm flex flex-col relative">
      
      {/* --- INJECTED CSS FOR TABLES AND IMAGE WRAPPING --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-tiptap-styles table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1rem 0 !important;
        }
        .custom-tiptap-styles td, .custom-tiptap-styles th {
          border: 1px solid hsl(var(--border)) !important;
          padding: 8px !important;
          position: relative;
        }
        .custom-tiptap-styles th {
          background-color: hsl(var(--muted)) !important;
          font-weight: bold !important;
        }
        .custom-tiptap-styles img[data-align="left"] {
          float: left;
          margin: 0.5rem 1.5rem 1rem 0;
        }
        .custom-tiptap-styles img[data-align="right"] {
          float: right;
          margin: 0.5rem 0 1rem 1.5rem;
        }
        .custom-tiptap-styles img[data-align="center"] {
          display: block;
          margin: 1.5rem auto;
          clear: both;
        }
      `}} />

      {/* --- MAIN TOOLBAR --- */}
      <div className="bg-muted/30 p-2 flex flex-wrap gap-1 border-b border-border items-center sticky top-0 z-10">
        
        {/* Undo / Redo */}
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={16} /></Button>
        
        <ToolbarSeparator />

        {/* Text Formatting */}
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('underline') ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('strike') ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough size={16} /></Button>

        <ToolbarSeparator />

        {/* Alignment */}
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left"><AlignLeft size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center"><AlignCenter size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right"><AlignRight size={16} /></Button>

        <ToolbarSeparator />

        {/* Colors */}
        <Popover>
          <PopoverTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Text Color"><Palette size={16} className="text-blue-500" /></Button></PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="text-xs font-semibold mb-2">Text Color</div>
            <Input type="color" className="w-full h-8 p-0 border-0 rounded cursor-pointer" onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()} />
            <Button type="button" variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => editor.chain().focus().unsetColor().run()}>Reset Color</Button>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Highlight Color"><Highlighter size={16} className="text-yellow-500" /></Button></PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="text-xs font-semibold mb-2">Background Color</div>
            <Input type="color" className="w-full h-8 p-0 border-0 rounded cursor-pointer" defaultValue="#ffff00" onInput={(e) => editor.chain().focus().toggleHighlight({ color: (e.target as HTMLInputElement).value }).run()} />
            <Button type="button" variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => editor.chain().focus().unsetHighlight().run()}>Reset Background</Button>
          </PopoverContent>
        </Popover>

        <ToolbarSeparator />

        {/* Lists & Typography */}
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 1"><Heading1 size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List"><List size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('orderedList', { type: '1' }) ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleOrderedList().updateAttributes('orderedList', { type: '1' }).run()} title="Numbered List"><ListOrdered size={16} /></Button>
        <Button type="button" variant="ghost" className={`h-8 px-2 text-xs font-bold ${editor.isActive('orderedList', { type: 'I' }) ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleOrderedList().updateAttributes('orderedList', { type: 'I' }).run()} title="Roman Numerals">I, II</Button>
        
        <ToolbarSeparator />

        {/* Link Popover */}
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('link') ? 'bg-primary/20 text-primary' : ''}`} title="Insert Link"><LinkIcon size={16} /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 shadow-lg">
            <div className="text-xs font-semibold mb-2">URL:</div>
            <div className="flex gap-2">
              <Input placeholder="https://..." value={linkUrlInput} onChange={(e) => setLinkUrlInput(e.target.value)} className="h-8 text-xs" />
              <Button size="sm" className="h-8" onClick={handleInsertLink}><Check size={14} /></Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Custom Image Popover */}
        <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
          <PopoverTrigger asChild>
             <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Insert Image"><ImageIcon size={16} /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 shadow-xl">
            <div className="space-y-3">
              <div className="text-sm font-semibold">Add Image</div>
              <div className="flex gap-2">
                <Input placeholder="Paste Image URL..." value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} className="h-8 text-xs flex-1" />
                <Button size="sm" className="h-8 shrink-0" onClick={handleInsertImageUrl}>Add</Button>
              </div>
              <div className="relative text-center"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-popover px-2 text-muted-foreground">OR</span></div></div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              <Button type="button" variant="outline" className="w-full h-8 text-xs" onClick={() => fileInputRef.current?.click()} disabled={isUploading || !onImageUpload}>
                {isUploading ? "Uploading..." : <><UploadCloud size={14} className="mr-2" /> Upload from PC</>}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : ''}`} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote"><Quote size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider Line"><Minus size={16} /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table"><TableIcon size={16} /></Button>

        <ToolbarSeparator />

        {/* Greek Alphabet */}
        <div className="flex gap-1 items-center">
          <Button type="button" variant="ghost" className="h-8 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertGreek('α')}>α</Button>
          <Button type="button" variant="ghost" className="h-8 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertGreek('β')}>β</Button>
          <Button type="button" variant="ghost" className="h-8 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertGreek('γ')}>γ</Button>
          <Button type="button" variant="ghost" className="h-8 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertGreek('Ω')}>Ω</Button>
        </div>
      </div>

      {/* --- FLOATING TABLE CONTROLS (Only visible when inside a table) --- */}
      {editor.isActive('table') && (
        <div className="bg-primary/10 p-2 flex flex-wrap gap-2 border-b border-primary/20 items-center justify-center animate-in slide-in-from-top-2">
          <span className="text-xs font-bold text-primary mr-2 flex items-center gap-1"><Grid3X3 size={14} /> Table:</span>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().addRowAfter().run()}><ArrowDownToLine size={12} className="mr-1" /> Add Row</Button>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().deleteRow().run()}><Trash2 size={12} className="mr-1 text-destructive" /> Del Row</Button>
          <div className="w-px h-4 bg-primary/20 mx-1" />
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().addColumnAfter().run()}><ArrowRightToLine size={12} className="mr-1" /> Add Col</Button>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().deleteColumn().run()}><Trash2 size={12} className="mr-1 text-destructive" /> Del Col</Button>
          <div className="w-px h-4 bg-primary/20 mx-1" />
          <Button type="button" variant="destructive" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 size={12} className="mr-1" /> Delete Table</Button>
        </div>
      )}

      {/* --- FLOATING IMAGE CONTROLS (Word-like behavior) --- */}
      {editor.isActive('image') && (
        <div className="bg-blue-500/10 p-2 flex flex-wrap gap-2 border-b border-blue-500/20 items-center justify-center animate-in slide-in-from-top-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mr-2 flex items-center gap-1"><ImageIcon size={14} /> Image:</span>
          
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}><Minimize size={12} className="mr-1" /> 50%</Button>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()}><Maximize size={12} className="mr-1" /> 100%</Button>
          
          <div className="w-px h-4 bg-blue-500/20 mx-1" />
          
          {/* Text Wrap Alignments */}
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()} title="Float Left"><AlignLeftIcon size={12} className="mr-1" /> Wrap Left</Button>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()} title="Center"><AlignCenter size={12} className="mr-1" /> Center</Button>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()} title="Float Right"><AlignRightIcon size={12} className="mr-1" /> Wrap Right</Button>
        </div>
      )}

      {/* --- EDITOR CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto max-h-[700px] cursor-text" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}