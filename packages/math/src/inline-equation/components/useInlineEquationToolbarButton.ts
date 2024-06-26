import { getSelectionText, useEditorRef } from '@udecode/plate-common';

import { insertInlineEquation } from '../transforms';

export const useInlineToolbarButtonState = () => {
  const editor = useEditorRef();

  return { editor };
};

export const useInlineToolbarButton = ({
  editor,
}: ReturnType<typeof useInlineToolbarButtonState>) => {
  return {
    props: {
      onClick: () => {
        const texExpression = getSelectionText(editor);
        insertInlineEquation(editor, texExpression);
      },
    },
  };
};
