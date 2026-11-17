// Anything can be thrown in JavaScript, so narrow it before reading .message
export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong'
}
