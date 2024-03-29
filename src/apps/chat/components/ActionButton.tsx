import type { PropsWithChildren } from 'react';
import Tippy from '@tippyjs/react';

export type ActionButtonProps = PropsWithChildren & {
  text?: string;
  active?: boolean;
  onClick?: () => void;
  onClickOutside?: () => void;
};

export default function ActionButton({
  text,
  children,
  active,
  onClick,
  onClickOutside,
}: ActionButtonProps) {
  return (
    <Tippy
      content={text}
      placement={'right'}
      duration={0}
      hideOnClick={true}
      trigger={'mouseenter'}
      onClickOutside={onClickOutside}
    >
      <button
        className={`ai-action-button flex items-center justify-center active:bg-light-300 ${
          active && 'text-indigo-600'
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    </Tippy>
  );
}
