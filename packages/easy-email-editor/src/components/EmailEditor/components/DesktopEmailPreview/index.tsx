import React, { useMemo } from 'react';
import { useActiveTab } from '@/hooks/useActiveTab';
import { ActiveTabKeys } from '@/components/Provider/BlocksProvider';
import { usePreviewEmail } from '@/hooks/usePreviewEmail';
import { useEditorContext } from '@/hooks/useEditorContext';
import { createPortal } from 'react-dom';

export function DesktopEmailPreview() {
  const { activeTab } = useActiveTab();
  const { errMsg, html } = usePreviewEmail();

  const { pageData } = useEditorContext();

  const fonts = useMemo(() => {
    return pageData.data.value.fonts || [];
  }, [pageData.data.value.fonts]);

  const isActive = activeTab === ActiveTabKeys.PC;

  if (errMsg) {
    return (
      <div style={{ textAlign: 'center', fontSize: 24, color: 'red' }}>
        <>{errMsg}</>
      </div>
    );
  }

  // Use srcdoc iframe for preview — avoids React 19 createPortal issues
  // with shadow DOM containers
  return (
    <div style={{ height: '100%' }}>
      <iframe
        title='desktop-preview'
        srcDoc={html || ''}
        style={{
          border: 'none',
          height: '100%',
          width: '100%',
        }}
      />
      {createPortal(
        <>
          {fonts.map((item, index) => (
            <link
              key={index}
              href={item.href}
              rel='stylesheet'
              type='text/css'
            />
          ))}
        </>,
        document.body,
      )}
    </div>
  );
}
