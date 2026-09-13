import type { ZodError, ZodType } from 'zod';
import { z } from 'zod';
import { ValidationError } from '../errors.ts';

/**
 * Validerer formen på noe som kommer utenfra, og gjør Zod-feil om til
 * ValidationError slik at errorHandler svarer med 400 og en lesbar melding.
 * Forretningsreglene hører ikke hjemme her -- de ligger i service-laget.
 */
export function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(describe(result.error));
  }
  return result.data;
}

const positiveInteger = z.coerce.number().int().positive();

export function parseNumericParam(value: unknown, name: string): number {
  const result = positiveInteger.safeParse(value);
  if (!result.success) {
    throw new ValidationError(`${name} must be a positive integer`);
  }
  return result.data;
}

function describe(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.join('.');
      return field ? `${field}: ${issue.message}` : issue.message;
    })
    .join('; ');
}
