export const site = {
  name: 'AIRFISHER',
  title: 'AIRFISHER · Interfaces, Ideas, and a Brighter Tomorrow',
  description: 'I build interfaces and write about the craft.',
};
export const formatDate = (date: Date) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
}).format(date);
// YYYY.MM.DD (e.g. 2026.10.26), always in UTC so build machines can't shift the day.
export const formatDateDot = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};
