/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import JoditEditor from "jodit-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounceEffect } from "./useDebounceEffect";

export default function MyEditor({ value, onBlur }) {
  const [editorInstance, setEditorInstance] = useState(null);
  const debouncedValue = useDebounceEffect(value, 500);
  const navigate = useNavigate();

  useEffect(() => {
    if (editorInstance) {
      editorInstance.focus();
    }
  }, [editorInstance]);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 400,
      width: '100%',
      uploader: {
        insertImageAsBase64URI: true,
      },
      image: {
        resize: {
          enabled: true,
          min_width: 100,
          min_height: 100,
        },
      },
      allowResizeX: true,
      allowResizeY: true,
      toolbarSticky: false,
      buttons: [
        'source', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
        'superscript', 'subscript', '|', 'ul', 'ol', '|', 'outdent', 'indent', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|', 'image', 'video', 'table', 'link',
        '|', 'align', 'undo', 'redo', '|', 'cut', 'copy', 'paste', '|',
        'hr', 'eraser', 'fullsize', 'print',
      ],
      events: {
        dblclick: (event) => {
          const target = event.target;
          if (target.tagName === 'IMG') {
            const imageSrc = encodeURIComponent(target.src);
            navigate(`/view-image?src=${imageSrc}`);
          }
        },
      },
    }),
    [navigate]
  );

  return (
    <JoditEditor
      value={debouncedValue}
      config={config}
      tabIndex={2}
      onBlur={onBlur}
      onChange={(newContent) => onBlur(newContent)}
      ref={(instance) => {
        if (instance) {
          setEditorInstance(instance);
        }
      }}
    />
  );
}
