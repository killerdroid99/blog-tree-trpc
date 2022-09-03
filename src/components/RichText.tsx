import { EditorContent, BubbleMenu, Editor } from "@tiptap/react";
import {
	FaBold,
	FaCode,
	FaHeading,
	FaItalic,
	FaList,
	FaStrikethrough,
} from "react-icons/fa";
import { useCallback } from "react";

const Tiptap = ({ editor }: { editor: Editor | null }) => {
	const addImage = useCallback(() => {
		const url = window.prompt("URL");

		if (url) {
			editor?.chain().focus().setImage({ src: url }).run();
		}
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<>
			{editor && (
				<BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
					<div className="flex text-xs">
						<button
							type="button"
							onClick={() => editor.chain().focus().toggleBold().run()}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold ${
								editor.isActive("bold") && "ring-2 ring-secondary-focus"
							}`}
						>
							<FaBold />
						</button>
						<button
							type="button"
							onClick={() => editor.chain().focus().toggleItalic().run()}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold ${
								editor.isActive("italic") && "ring-2 ring-secondary-focus"
							}`}
						>
							<FaItalic />
						</button>
						<button
							type="button"
							onClick={() => editor.chain().focus().toggleCode().run()}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold ${
								editor.isActive("code") && "ring-2 ring-secondary-focus"
							}`}
						>
							<FaCode />
						</button>
						<button
							type="button"
							onClick={() => editor.chain().focus().toggleStrike().run()}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold ${
								editor.isActive("strike") && "ring-2 ring-secondary-focus"
							}`}
						>
							<FaStrikethrough />
						</button>
						<button
							type="button"
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 1 }).run()
							}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold place-items-center grid grid-flow-col ${
								editor.isActive("heading", { level: 1 }) &&
								"ring-2 ring-secondary-focus"
							}`}
						>
							<FaHeading />
							<span>1</span>
						</button>
						<button
							type="button"
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold place-items-center grid grid-flow-col ${
								editor.isActive("heading", { level: 2 }) &&
								"ring-2 ring-secondary-focus"
							}`}
						>
							<FaHeading />
							<span>2</span>
						</button>
						<button
							type="button"
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 3 }).run()
							}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold place-items-center grid grid-flow-col ${
								editor.isActive("heading", { level: 3 }) &&
								"ring-2 ring-secondary-focus"
							}`}
						>
							<FaHeading />
							<span>3</span>
						</button>
						<button
							type="button"
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							className={`p-2 text-[0.75rem] bg-neutral-800 text-white rounded-sm mx-px font-bold ${
								editor.isActive("bulletList") && "ring-2 ring-secondary-focus"
							}`}
						>
							<FaList />
						</button>
					</div>
				</BubbleMenu>
			)}
			<EditorContent editor={editor} />
			<button
				type="button"
				onClick={addImage}
				className="absolute py-px px-2 rounded-full font-semibold bg-amber-500 hover:bg-amber-600 focus:ring-fuchsia-500 focus:ring-2 transition-all ease-in outline-none border-none top-2 left-2 text-amber-900 text-xs"
			>
				Set Image
			</button>
		</>
	);
};

export default Tiptap;
