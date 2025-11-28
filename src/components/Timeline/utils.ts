import { TimelineItem } from './index';

/**
 * 将飞书多维表格数据转换为时间轴项目格式
 * @param tableData 从飞书获取的原始数据
 * @param config 配置项，指定哪些列对应标题、日期等
 * @returns 格式化后的时间轴项目数组
 */
export const convertToTimelineItems = (
  tableData: any[],
  config: {
    titleField: string;
    dateField: string;
    groupField?: string;
    descriptionField?: string;
    colorField?: string;
  }
): TimelineItem[] => {
  if (!tableData || !Array.isArray(tableData)) {
    return [];
  }

  return tableData.map((row, index) => {
    // 确保日期格式正确
    const rawDate = row[config.dateField];
    let formattedDate = rawDate;
    
    // 处理不同的日期格式
    if (typeof rawDate === 'string' && rawDate.includes('T')) {
      // ISO 8601 格式
      formattedDate = rawDate.split('T')[0];
    } else if (typeof rawDate !== 'string') {
      // 转换为字符串
      formattedDate = String(rawDate);
    }

    return {
      id: row._id || `item_${index}`,
      title: row[config.titleField] || `Item ${index + 1}`,
      date: formattedDate,
      group: config.groupField ? row[config.groupField] : undefined,
      description: config.descriptionField ? row[config.descriptionField] : undefined,
      color: config.colorField ? row[config.colorField] : undefined
    };
  });
};

/**
 * 从时间轴项目中提取所有唯一的分组
 * @param items 时间轴项目数组
 * @returns 分组名称数组
 */
export const extractGroups = (items: TimelineItem[]): string[] => {
  const groups = new Set<string>();
  items.forEach(item => {
    if (item.group) {
      groups.add(item.group);
    }
  });
  return Array.from(groups).sort();
};

/**
 * 格式化日期显示
 * @param dateString 日期字符串
 * @param format 格式化类型
 * @returns 格式化后的日期字符串
 */
export const formatDate = (dateString: string, format: 'full' | 'short' = 'full'): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    if (format === 'short') {
      return date.toLocaleDateString();
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

/**
 * 验证日期字符串是否有效
 * @param dateString 日期字符串
 * @returns 是否为有效日期
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * 生成默认颜色
 * @param index 索引值
 * @returns 十六进制颜色值
 */
export const generateDefaultColor = (index: number): string => {
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d',
    '#722ed1', '#13c2c2', '#fa8c16', '#eb2f96'
  ];
  return colors[index % colors.length];
};