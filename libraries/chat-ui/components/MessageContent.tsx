import markdown from '@ai-chat/shared/client/markdown';
import type { MessageContentProps } from '../interfaces';

export function MessageContent({ payload }: MessageContentProps) {
  const content = markdown.render(payload.content);

  return (
    <div
      className={`message-content message-markdown-content relative border border-transparent p-2 rounded-md text-sm max-w-[360px] md:max-w-[670px] ${
        payload.self ? 'itself mr-1 bg-blue-100' : 'ml-1 bg-white'
      }`}
    >
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
}
