import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  getMark,
  isMarkActive,
  removeMark,
  setMarks,
} from '@udecode/plate-common';
import {
  getPlatePluginType,
  useEventEditorId,
  useStoreEditorRef,
  useStoreEditorState,
} from '@udecode/plate-core';
import {
  ToolbarButton,
  ToolbarButtonProps,
  ToolbarDropdown,
} from '@udecode/plate-toolbar';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ColorPicker } from '../ColorPicker/ColorPicker';

type ToolbarColorPickerProps = {
  pluginKey?: string;
  icon: ReactNode;
  selectedIcon: ReactNode;
};

export const ToolbarColorPicker = ({
  pluginKey,
  icon,
  selectedIcon,
  ...rest
}: ToolbarColorPickerProps & ToolbarButtonProps) => {
  const editor = useStoreEditorState(useEventEditorId('focus'));
  const editorRef = useStoreEditorRef(useEventEditorId('focus'));
  const type = getPlatePluginType(editor, pluginKey);

  const color = editorRef && getMark(editorRef, type);

  const [selectedColor, setSelectedColor] = useState<string>();

  const updateColor = useCallback(
    (value: string) => {
      setSelectedColor(value);
      if (editorRef && editor && editor.selection) {
        Transforms.select(editorRef, editor.selection);
        ReactEditor.focus(editorRef);

        setMarks(editor, { [type]: value });
      }
    },
    [editor, editorRef, type]
  );

  const clearColor = useCallback(() => {
    if (editorRef && editor && editor.selection) {
      Transforms.select(editorRef, editor.selection);
      ReactEditor.focus(editorRef);

      if (selectedColor) {
        removeMark(editor, { key: type });
      }
    }
  }, [editor, editorRef, selectedColor, type]);

  useEffect(() => {
    if (editor?.selection) {
      setSelectedColor(color);
    }
  }, [color, editor?.selection]);

  return (
    <ToolbarDropdown
      control={
        <ToolbarButton
          active={!!editor?.selection && isMarkActive(editor, type)}
          icon={icon}
          {...rest}
        />
      }
    >
      <ColorPicker
        color={selectedColor || color}
        selectedIcon={selectedIcon}
        updateColor={updateColor}
        clearColor={clearColor}
      />
    </ToolbarDropdown>
  );
};
