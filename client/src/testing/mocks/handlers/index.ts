import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

export const handlers = [
  http.get(`${env.API_URL}/healthcheck`, async () => {
    return HttpResponse.json({ ok: true });
  }),
];
