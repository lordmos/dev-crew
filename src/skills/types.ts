/** Structured result returned by every skill. */
export interface SkillResult {
  ok: boolean;
  summary: string;
  details: string[];
}

export function success(summary: string, details: string[] = []): SkillResult {
  return { ok: true, summary, details };
}

export function failure(summary: string, details: string[] = []): SkillResult {
  return { ok: false, summary, details };
}
