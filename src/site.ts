export const site = {
  name: 'Airfisher',
  title: 'Airfisher 的个人博客',
  description: '关于技术、生活，以及值得记录的想法。',
};
export const formatDate = (date: Date) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
}).format(date);
