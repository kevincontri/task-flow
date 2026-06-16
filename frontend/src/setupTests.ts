// @ts-ignore
import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' })); // Liga o servidor mock. onUnhandledRequest faz com que requests sem handler falhem no teste, ao invés de ir à rede real.
afterEach(() => server.resetHandlers()); // Depois de cada teste, limpa overrides
afterAll(() => server.close()); // Desliga o servidor mock

