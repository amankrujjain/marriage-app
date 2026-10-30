/** Placeholder copy for unpublished spokes. Must include the primary keyword. */
export function todoCopy(primaryKeyword: string): string {
  return `TODO_COPY (must contain "${primaryKeyword}")`;
}

export function todoSteps(primaryKeyword: string, count = 3) {
  return Array.from({ length: count }, () => ({
    title: todoCopy(primaryKeyword),
    body: todoCopy(primaryKeyword),
  }));
}

export function todoTips(primaryKeyword: string, count = 3) {
  return Array.from({ length: count }, () => ({
    title: todoCopy(primaryKeyword),
    body: todoCopy(primaryKeyword),
  }));
}

export function todoFaqs(primaryKeyword: string, count = 4) {
  return Array.from({ length: count }, () => ({
    q: todoCopy(primaryKeyword),
    a: todoCopy(primaryKeyword),
  }));
}
