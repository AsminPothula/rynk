import { http, HttpResponse } from 'msw';
import {
  findUserByEmail,
  mockUsers,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from '../data/users';
import {
  generateTokenPair,
  getUserIdFromRefreshToken,
  storeRefreshToken,
  storeToken,
} from '../data/tokens';
import type {
  SignInDto,
  SignUpDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  SetUserPasswordDto,
  ChangePasswordDto,
} from '../../_api';

export const authHandlers = [
  http.post('*/auth/sign-in', async ({ request }) => {
    const body = (await request.json()) as SignInDto;

    if (
      body.email === TEST_USER_EMAIL &&
      body.password === TEST_USER_PASSWORD
    ) {
      const tokens = generateTokenPair('user-000');
      storeToken(tokens.accessToken, tokens.userId);
      storeRefreshToken(tokens.refreshToken, tokens.userId);
      return HttpResponse.json(tokens);
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    );
  }),

  http.post('*/auth/sign-up', async ({ request }) => {
    const body = (await request.json()) as SignUpDto;
    const existing = findUserByEmail(body.email);

    if (existing) {
      return HttpResponse.json(
        { message: 'User already exists' },
        { status: 409 },
      );
    }

    const newId = `user-${mockUsers.length + 1}`;
    const tokens = generateTokenPair(newId);
    storeToken(tokens.accessToken, tokens.userId);
    storeRefreshToken(tokens.refreshToken, tokens.userId);
    return HttpResponse.json(tokens);
  }),

  http.post('*/auth/refresh-token', async ({ request }) => {
    const body = (await request.json()) as RefreshTokenDto;
    const userId = getUserIdFromRefreshToken(body.refreshToken);

    if (!userId) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 },
      );
    }

    const tokens = generateTokenPair(userId);
    storeToken(tokens.accessToken, tokens.userId);
    storeRefreshToken(tokens.refreshToken, tokens.userId);
    return HttpResponse.json(tokens);
  }),

  http.post('*/auth/forgot-password', async ({ request }) => {
    const body = (await request.json()) as ForgotPasswordDto;
    void body;
    return HttpResponse.json({ message: 'Password reset email sent' });
  }),

  http.post('*/auth/set-password', async ({ request }) => {
    const body = (await request.json()) as SetUserPasswordDto;
    void body;
    return HttpResponse.json({ message: 'Password has been set successfully' });
  }),

  http.post('*/auth/change-password', async ({ request }) => {
    const body = (await request.json()) as ChangePasswordDto;
    void body;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json({ message: 'Password changed successfully' });
  }),

  http.get('*/auth/check-email', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const user = email ? findUserByEmail(email) : undefined;
    return HttpResponse.json({ isUserExists: !!user });
  }),
];
