export const site = {
  name: 'Airfisher',
  title: 'Airfisher\'s Blog',
  description: '记录技术实践、问题与思考。',
};
export const formatDate = (date: Date) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
}).format(date);
