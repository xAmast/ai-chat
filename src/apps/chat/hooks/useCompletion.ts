import { pick } from 'lodash-es';
import { useMemo } from 'react';

import openai from '../api/openai';
import { useCompletionService } from './useCompletionService';
import { useSender } from './useSender';

export function useCompletion() {
  const service = useCompletionService();

  const data = useMemo(
    () => service.data[service.cursor.index],
    [service.data, service.cursor.index]
  );

  const { sending, waiting, withRequest, abortRequest } = useSender();

  async function complete(input: string): Promise<string> {
    return withRequest(async (signal) => {
      service.draft(data.id, input);

      const payload = pick(service.preferences, [
        'model',
        'temperature',
        'max_tokens',
        'top_p',
        'frequency_penalty',
        'presence_penalty',
      ]);

      const res = await openai.createCompletion(
        { ...payload, prompt: `${input}<|endoftext|>` },
        { signal }
      );

      const content = res.choices[0].text;
      service.complete(data.id, input + content);

      return content;
    });
  }

  return {
    data,
    sending,
    waiting,
    complete,
    abort: abortRequest,
  };
}
