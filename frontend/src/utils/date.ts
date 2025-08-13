/**
 * 将Unix时间戳转换为可读的日期格式
 * @param timestamp Unix时间戳（秒）
 * @returns string 格式化后的日期字符串
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // 转换为毫秒
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * 获取相对时间描述
 * @param timestamp Unix时间戳（秒）
 * @returns string 相对时间描述
 */
export function getRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) {
    return '刚刚';
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`;
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}天前`;
  } else {
    return formatTimestamp(timestamp);
  }
}

/**
 * 检查时间戳是否有效
 * @param timestamp Unix时间戳
 * @returns boolean 是否有效
 */
export function isValidTimestamp(timestamp: number): boolean {
  return timestamp > 0 && timestamp < 2147483647; // 2038年问题之前
} 