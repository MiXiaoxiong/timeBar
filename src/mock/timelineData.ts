import { TimelineItem } from '../components/Timeline';

// 完整的时间节点模拟数据，包含所有新增字段
export const mockTimelineItems: TimelineItem[] = [
  {
    id: '1',
    title: '项目启动会议',
    description: '讨论项目目标和范围',
    date: '2023-04-01T09:00:00',
    group: '规划',
    status: 'completed',
    priority: 'high',
    assignee: '张三',
    milestone: false,
    tags: ['会议', '规划']
  },
  {
    id: '2',
    title: '需求分析完成',
    description: '完成详细的需求文档',
    date: '2023-04-10T15:00:00',
    group: '规划',
    status: 'completed',
    priority: 'high',
    assignee: '李四',
    milestone: true,
    tags: ['里程碑', '需求']
  },
  {
    id: '3',
    title: 'UI设计评审',
    description: '评审界面设计稿',
    date: '2023-04-15T10:00:00',
    group: '设计',
    status: 'in_progress',
    priority: 'medium',
    assignee: '王五',
    milestone: false,
    tags: ['设计', '评审']
  },
  {
    id: '4',
    title: '前端开发',
    description: '实现用户界面和交互逻辑',
    date: '2023-04-20T09:00:00',
    group: '开发',
    status: 'in_progress',
    priority: 'high',
    assignee: '赵六',
    milestone: false,
    tags: ['开发', '前端']
  },
  {
    id: '5',
    title: '后端开发',
    description: '实现API接口和数据库',
    date: '2023-04-25T09:00:00',
    group: '开发',
    status: 'in_progress',
    priority: 'high',
    assignee: '孙七',
    milestone: false,
    tags: ['开发', '后端']
  },
  {
    id: '6',
    title: '集成测试',
    description: '测试系统各模块集成',
    date: '2023-05-11T09:00:00',
    group: '测试',
    status: 'pending',
    priority: 'medium',
    assignee: '周八',
    milestone: false,
    tags: ['测试', '集成']
  },
  {
    id: '7',
    title: '项目上线',
    description: '系统正式上线运行',
    date: '2023-05-25T09:00:00',
    group: '运维',
    status: 'pending',
    priority: 'high',
    assignee: '吴九',
    milestone: true,
    tags: ['里程碑', '上线']
  }
];

// 从模拟数据中提取所有分组
export const mockGroups = Array.from(new Set(mockTimelineItems.map(item => item.group)));

// 用于TimelineWithConfig组件的mock数据
export const mockData = {
  items: mockTimelineItems,
  groups: mockGroups
};
