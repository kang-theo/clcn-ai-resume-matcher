import { EditorContent, useEditor } from "@tiptap/react";
import { Button, Divider, Dropdown, MenuProps, Skeleton, Tooltip } from "antd";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Highlighter,
  Italic,
  Redo2,
  Save,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import React, { type FC, useEffect, useState } from "react";
// import { EditorState } from "prosemirror-state";
// import { mergeAttributes, Node, Editor } from "@tiptap/core";
// import { NodeSelection, TextSelection } from "prosemirror-state";
import BulletList from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import "./editor.css";

export const ResumeEditor: FC<{
  title?: string;
  value: string;
  fetching: boolean;
  url?: string;
  methodType?: string;
  saveType?: "json" | "text" | "html";
  onSave?: (value: any) => void;
  onComplete?: () => void;
  onChange?: (content: any) => void;
  headless?: boolean;
}> = (props) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // const [selectedSegment, setSelectedSegment] = useState('catalog');

  const editor = useEditor({
    extensions: [
      // Document,
      // Paragraph,
      // Text,
      TextStyle,
      // FontFamily,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      ListItem,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      StarterKit,
      // .configure({
      //   // bulletList: {
      //   //   keepMarks: true,
      //   //   keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      //   // },
      //   // orderedList: {
      //   //   keepMarks: true,
      //   //   keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      //   // },
      // }),
      // https://github.com/ueberdosis/tiptap/issues/291
      // Paragraph.extend({
      //   parseHTML() {
      //     return [{ tag: "div" }];
      //   },
      //   renderHTML({ HTMLAttributes }) {
      //     return [
      //       "div",
      //       mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      //       0,
      //     ];
      //   },
      // }),
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "tiptap-underline",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "tiptap-highlight",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
        alignments: ["left", "center", "right"],
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Placeholder.configure({
        // considerAnyAsEmpty: true,
        // includeChildren: true,
        // emptyNodeClass: "is-empty",
        placeholder: () => "Please input content",
      }),
    ],
    content: props.value,
    autofocus: "end", // 'start' | 'end' | 'all'
    editable: true,
    onUpdate: ({ editor }) => {
      // const json = editor.getJSON();
      const html = editor.getHTML();
      // const text = editor.getText();
      // console.log({ json, html, text });
      if (props.onChange) props.onChange(html);
      // send the content to an API here
    },
  });

  useEffect(() => {
    // 拉取新的内容
    if (editor && props.value) {
      // editor.commands.setContent(JSON.parse(props.value));
      editor.commands.setContent(props.value);
    }

    // editor创建成功，没有内容
    // if (editor && !props.value) {
    //   setLoading(false);
    // }
  }, [editor, props.value]);

  const TypographyItems: MenuProps["items"] = [
    {
      key: "default",
      label: "Default",
    },
    {
      key: "LiSu",
      label: "LiSu",
    },
    {
      key: "SimSun",
      label: "SimSun",
    },
    {
      key: "monospace",
      label: "monospace",
    },
  ];

  const AlignmentItems: MenuProps["items"] = [
    {
      key: "left",
      label: <AlignLeft size={16} />,
    },
    {
      key: "center",
      label: <AlignCenter size={16} />,
    },
    {
      key: "right",
      label: <AlignRight size={16} />,
    },
  ];

  const filterSelectedItems = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems([...selectedItems.filter((i) => i !== item)]);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  if (!editor) {
    return null;
  }

  if (props.fetching) return <Skeleton />;

  const getPayloadType = () => {
    switch (props.saveType) {
      case "json":
        return [
          {
            "Content-Type": "application/json",
          },
          JSON.stringify(editor?.getJSON()),
        ];
      case "text":
        return [
          {
            "Content-Type": "text/plain",
          },
          JSON.stringify(editor?.getText()),
        ];
      case "html":
        return [
          {
            "Content-Type": "text/html",
          },
          JSON.stringify(editor?.getHTML()),
        ];
      default:
        return [
          {
            "Content-Type": "application/json",
          },
          JSON.stringify(editor?.getJSON()),
        ];
    }
  };

  return (
    <div>
      {!props.headless && (
        <div className='bg-[#e5e6eb] w-full py-1 mx-auto px-2 rounded-tl-lg rounded-tr-lg flex items-center justify-center space-x-1'>
          <Tooltip placement='top' title='Undo'>
            <Button
              type='text'
              size='small'
              onClick={() => editor?.chain().focus().undo().run()}
            >
              <Undo2 size='16' />
            </Button>
          </Tooltip>
          <Tooltip placement='top' title='Redo'>
            <Button
              type='text'
              size='small'
              onClick={() => editor?.chain().focus().redo().run()}
            >
              <Redo2 size='16' />
            </Button>
          </Tooltip>
          <Divider type={"vertical"} />
          <Tooltip placement='top' title='Heading'>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    label: "H1",
                  },
                  {
                    key: "2",
                    label: "H2",
                  },
                  {
                    key: "3",
                    label: "H3",
                  },
                  {
                    key: "4",
                    label: "H4",
                  },
                  {
                    key: "5",
                    label: "H5",
                  },
                  {
                    key: "6",
                    label: "H6",
                  },
                ],
                selectable: true,
                defaultSelectedKeys: ["default"],
                onClick: ({ key }: { key: string }) => {
                  // if (key === 'default') {
                  //   editor?.chain().focus().unsetFontFamily().run();
                  // } else {
                  //   editor?.chain().focus().setFontFamily(key).run();
                  // }
                  editor
                    ?.chain()
                    .focus()
                    .toggleHeading({
                      level: parseInt(key) as 1 | 2 | 3 | 4 | 5 | 6,
                    })
                    .run();
                },
              }}
            >
              <Button
                type='text'
                size='small'
                icon={<ChevronDown size={16} />}
                iconPosition='end'
                className='flex items-center justify-center'
              >
                Typography
              </Button>
            </Dropdown>
          </Tooltip>
          <Tooltip placement='top' title='List'>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "bullet",
                    label: "bullet list",
                  },
                  {
                    key: "ordered",
                    label: "ordered list",
                  },
                  {
                    key: "sink",
                    label: "sink list",
                  },
                  {
                    key: "lift",
                    label: "lift list",
                  },
                ],
                selectable: true,
                // defaultSelectedKeys: ['default'],
                onClick: ({ key }: { key: string }) => {
                  switch (key) {
                    case "bullet":
                      editor?.chain().focus().toggleBulletList().run();
                      break;
                    case "ordered":
                      editor?.chain().focus().toggleOrderedList().run();
                      break;
                    case "sink":
                      editor?.chain().focus().sinkListItem("listItem").run();
                      break;
                    case "lift":
                      editor?.chain().focus().liftListItem("listItem").run();
                      break;
                  }
                },
              }}
            >
              <Button
                type='text'
                size='small'
                icon={<ChevronDown size={16} />}
                iconPosition='end'
                className='flex items-center justify-center'
              >
                List
              </Button>
            </Dropdown>
          </Tooltip>
          <Tooltip placement='top' title='Font Family'>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: TypographyItems,
                selectable: true,
                defaultSelectedKeys: ["default"],
                onClick: ({ key }: { key: string }) => {
                  if (key === "default") {
                    editor?.chain().focus().unsetFontFamily().run();
                  } else {
                    editor?.chain().focus().setFontFamily(key).run();
                  }
                },
              }}
            >
              <Button
                type='text'
                size='small'
                icon={<ChevronDown size={16} />}
                iconPosition='end'
                className='flex items-center justify-center'
              >
                Font Family
              </Button>
            </Dropdown>
          </Tooltip>
          <Tooltip placement='top' title='Bold'>
            <Button
              type='text'
              size='small'
              onClick={() => {
                editor?.chain().focus().toggleBold().run();
                filterSelectedItems("bold");
              }}
              className={selectedItems.includes("bold") ? "is-active" : ""}
            >
              <Bold size='16' />
            </Button>
          </Tooltip>
          <Tooltip placement='top' title='Italic'>
            <Button
              type='text'
              size='small'
              onClick={() => {
                editor?.chain().focus().toggleItalic().run();
                filterSelectedItems("italic");
              }}
              className={selectedItems.includes("italic") ? "is-active" : ""}
            >
              <Italic size='16' />
            </Button>
          </Tooltip>
          {/* 
        <Tooltip placement='top' title='Strike'>
          <Button
            type='text'
            size='small'
            onClick={() => {
              editor?.chain().focus().toggleStrike().run();
              filterSelectedItems("strike");
            }}
            className={selectedItems.includes("strike") ? "is-active" : ""}
          >
            <Strikethrough size='16' />
          </Button>
        </Tooltip>
        <Tooltip placement='top' title='Underline'>
          <Button
            type='text'
            size='small'
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
              filterSelectedItems("underline");
            }}
            className={selectedItems.includes("underline") ? "is-active" : ""}
          >
            <UnderlineIcon size='16' />
          </Button>
        </Tooltip>
        <Tooltip placement='top' title='Highlight'>
          <Button
            type='text'
            size='small'
            onClick={() => {
              editor?.chain().focus().toggleHighlight().run();
              filterSelectedItems("highlight");
            }}
            className={selectedItems.includes("highlight") ? "is-active" : ""}
          >
            <Highlighter size='16' />
          </Button>
        </Tooltip> */}
          <Tooltip placement='top' title='Align'>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: AlignmentItems,
                selectable: true,
                defaultSelectedKeys: ["left"],
                onClick: ({ key }: any) => editor?.commands.setTextAlign(key),
              }}
            >
              <Button
                type='text'
                size='small'
                icon={<ChevronDown size={16} />}
                iconPosition='end'
                className='flex items-center justify-center'
              >
                <AlignJustify size={16} />
              </Button>
            </Dropdown>
          </Tooltip>
          <Divider type={"vertical"} />
          <Tooltip placement='top' title='Save'>
            <Button
              type='text'
              size='small'
              onClick={(e: any) => {
                e.preventDefault();
                const [contentType, payload] = getPayloadType();

                if (props.onSave) props.onSave(payload);

                if (props.url) {
                  fetch(props.url, {
                    method: props.methodType ?? "POST",
                    body: payload as any,
                    headers: contentType as any,
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.meta.code !== "OK") {
                        console.error("Failed to save content");
                      }
                      if (props.onComplete) props.onComplete();
                    })
                    .catch((err) => {
                      console.error("Failed to save content: ", err);
                    });
                }
              }}
            >
              <Save size={16} />
            </Button>
          </Tooltip>
        </div>
      )}

      <div
        className={`w-full mx-auto ${
          props.headless ? "" : "border border-[#e5e6eb]"
        } rounded-bl-lg rounded-br-lg`}
      >
        <EditorContent editor={editor} className='resume-editor' />
      </div>
    </div>
  );
};

export default ResumeEditor;
