import {
  type InsertNodesOptions,
  type PlateEditor,
  type TElement,
  type Value,
  getPluginType,
  isExpanded,
  isSelectionAtBlockStart,
  setElements,
  someNode,
  wrapNodes,
} from '@udecode/plate-common/server';

import { ELEMENT_CODE_BLOCK } from '../constants';
import { getCodeLineType } from '../options';

/**
 * Insert a code block: set the node to code line and wrap it with a code block.
 * If the cursor is not at the block start, insert break before.
 */
export const insertCodeBlock = <V extends Value>(
  editor: PlateEditor<V>,
  insertNodesOptions: Omit<InsertNodesOptions<V>, 'match'> = {}
) => {
  if (!editor.selection || isExpanded(editor.selection)) return;

  const matchCodeElements = (node: TElement) =>
    node.type === getPluginType(editor, ELEMENT_CODE_BLOCK) ||
    node.type === getCodeLineType(editor);

  if (
    someNode(editor, {
      match: matchCodeElements,
    })
  ) {
    return;
  }
  if (!isSelectionAtBlockStart(editor)) {
    editor.insertBreak();
  }

  setElements(
    editor,
    {
      children: [{ text: '' }],
      type: getCodeLineType(editor),
    },
    insertNodesOptions
  );

  wrapNodes<TElement>(
    editor,
    {
      children: [],
      type: getPluginType(editor, ELEMENT_CODE_BLOCK),
    },
    insertNodesOptions
  );
};
