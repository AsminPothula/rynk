import { http, HttpResponse, delay } from 'msw';
import { mockUsers } from '../data/users';
import { getUserIdFromToken } from '../data/tokens';
import type { UpdateMyProfileDto } from '../../_api';

function extractUserId(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return getUserIdFromToken(token);
}

export const userHandlers = [
  http.get('*/user/profile', ({ request }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  http.put('*/user/profile', async ({ request }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as UpdateMyProfileDto;
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.firstName = body.firstName;
    user.lastName = body.lastName;

    return HttpResponse.json(user);
  }),

  http.get('*/user/users', async ({ request }) => {
    await delay(1500);
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const skip = Number(url.searchParams.get('skip') ?? 0);

    const items = mockUsers.slice(skip, skip + limit);

    return HttpResponse.json({
      items,
      total: mockUsers.length,
      skip,
      limit,
    });
  }),
];
