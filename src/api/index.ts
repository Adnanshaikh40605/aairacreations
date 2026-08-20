import { mockClient } from './mock/index.ts'

/** Mock client only — do not swap for HTTP until wiring is explicitly requested. */
export const api = mockClient
