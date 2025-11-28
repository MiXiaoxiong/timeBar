import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';
import { useTimelineTheme } from '../../hooks';

// 时间节点类型定义
export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  group?: string;
  description?: string;
  color?: string;
  status?: 'completed' | 'pending' | 'in_progress' | 'important';
  priority?: 'high' | 'medium' | 'low';
  assignee?: string;
  milestone?: boolean;
  tags?: string[];
}

// 时间轴配置类型
export interface TimelineProps {
  items: TimelineItem[];
  groups?: string[];
  selectedGroup?: string;
  onItemClick?: (item: TimelineItem) => void;
  onItemHover?: (item: TimelineItem, hovering: boolean) => void;
  selectedItem?: string | null;
  onSelectItem?: (itemId: string | null) => void;
  showLabels?: boolean;
  showMilestones?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  groups = [],
  selectedGroup = '',
  onItemClick,
  onItemHover,
  selectedItem = null,
  onSelectItem,
  showLabels = true,
  showMilestones = true
}) => {
  const { t } = useTranslation();
  const theme = useTimelineTheme();
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  // 根据选中的分组筛选时间节点
  const filteredItems = selectedGroup
    ? items.filter(item => item.group === selectedGroup)
    : items;

  // 按日期排序
  const sortedItems = [...filteredItems].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // 获取状态颜色
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return theme.themeColors.success;
      case 'in_progress': return theme.themeColors.warning;
      case 'important': return theme.themeColors.error;
      default: return theme.themeColors.primary;
    }
  };

  // 获取优先级标签样式
  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case 'high': return { backgroundColor: theme.themeColors.error, color: 'white' };
      case 'medium': return { backgroundColor: theme.themeColors.warning, color: 'white' };
      case 'low': return { backgroundColor: theme.themeColors.success, color: 'white' };
      default: return { backgroundColor: theme.themeColors.borderColor, color: theme.themeColors.textSecondary };
    }
  };

  // 处理鼠标悬停
  const handleMouseEnter = (item: TimelineItem) => {
    setHoveredItem(item.id || null);
    onItemHover?.(item, true);
  };

  const handleMouseLeave = (item: TimelineItem) => {
    setHoveredItem(null);
    onItemHover?.(item, false);
  };

  // 处理点击选择
  const handleItemClick = (item: TimelineItem) => {
    if (onSelectItem) {
      onSelectItem(item.id || null);
    }
    onItemClick?.(item);
  };

  return (
    <div className={styles.timelineContainer} style={{ backgroundColor: theme.bgColor }}>
      <h2 className={styles.timelineTitle} style={{ color: theme.themeColors.textPrimary }}>{t('timeline.title')}</h2>
      <div className={styles.timeline}>
        {filteredItems.length === 0 && (
          <div className={styles.emptyState}>
            <p style={{ color: theme.themeColors.textSecondary }}>{t('timeline.empty')}</p>
          </div>
        )}
        {filteredItems.map((item, index) => {
          const groupColor = theme.getGroupColor?.(item.group, index) || (item.color || '#1890ff');
          const isSelected = selectedItem !== null && selectedItem === item.id;
          const isHovered = hoveredItem !== null && hoveredItem === item.id;
          const isMilestone = item.milestone && showMilestones;

          return (
            <div 
              key={item.id || index} 
              className={[styles.timelineItem, isSelected && styles.selectedItem, isHovered && styles.hoveredItem].filter(Boolean).join(' ')}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={() => handleMouseLeave(item)}
              style={{
                borderColor: isSelected ? groupColor : theme.themeColors.borderColor,
                backgroundColor: isHovered ? `${groupColor}10` : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                className={[styles.timelineDot, isMilestone && styles.milestoneDot].filter(Boolean).join(' ')}
                style={{
                  backgroundColor: getStatusColor(item.status),
                  borderWidth: isSelected ? '3px' : '1px',
                  borderColor: theme.bgColor
                }}
              >
                {isMilestone && (
                  <span className={styles.milestoneIcon}>★</span>
                )}
              </div>
              <div className={styles.timelineContent} style={{ backgroundColor: theme.themeColors.cardBg }}>
                <div className={styles.timelineItemHeader}>
                  <div className={styles.timelineTitle} style={{ 
                    color: theme.themeColors.textPrimary,
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}>
                    {item.title}
                  </div>
                  <div className={styles.timelineMeta}>
                    {showLabels && item.priority && (
                      <span 
                        className={styles.priorityBadge}
                        style={getPriorityStyle(item.priority)}
                      >
                        {t(`timeline.priority.${item.priority}`)}
                      </span>
                    )}
                    {isMilestone && (
                      <span className={styles.milestoneBadge} style={{ backgroundColor: theme.themeColors.warning, color: 'white' }}>
                        {t('timeline.milestone')}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.timelineDate} style={{ color: theme.themeColors.textSecondary }}>
                  {new Date(item.date).toLocaleDateString()}
                </div>
                {item.description && (
                  <div className={styles.timelineDescription} style={{ color: theme.themeColors.textSecondary }}>
                    {item.description}
                  </div>
                )}
                {item.assignee && (
                  <div className={styles.timelineAssignee} style={{ color: theme.themeColors.textSecondary }}>
                    {t('timeline.assignee')}: {item.assignee}
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className={styles.timelineTags}>
                    {item.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className={styles.tag}
                        style={{ 
                          backgroundColor: `${groupColor}20`,
                          color: groupColor,
                          borderColor: groupColor
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;