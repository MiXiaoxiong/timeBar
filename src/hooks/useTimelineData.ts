import { useState, useEffect, useCallback } from 'react';
import { fetchFeishuTableData, fetchTablesList, fetchTableFields } from '../api/feishu';
import { convertToTimelineItems, extractGroups } from '../components/Timeline/utils';
import { TimelineItem } from '../components/Timeline';
import { mockTimelineItems, mockGroups } from '../mock/timelineData';

// 配置类型
interface TimelineConfig {
  appToken?: string;
  tableId?: string;
  viewId?: string;
  titleField?: string;
  dateField?: string;
  groupField?: string;
  descriptionField?: string;
  colorField?: string;
}

// 返回值类型
interface UseTimelineDataReturn {
  items: TimelineItem[];
  groups: string[];
  tables: Array<{appToken: string, tableId: string, tableName: string}>;
  fields: Array<{name: string, type: string}>;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  fetchTables: () => Promise<void>;
  fetchFields: () => Promise<void>;
}

/**
 * 时间轴数据管理钩子
 * @param config 配置参数
 * @returns 时间轴数据和操作方法
 */
export const useTimelineData = (config: TimelineConfig = {}): UseTimelineDataReturn => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [tables, setTables] = useState<Array<{appToken: string, tableId: string, tableName: string}>>([]);
  const [fields, setFields] = useState<Array<{name: string, type: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取表格数据
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 如果有配置有效的appToken和tableId，则从API获取数据
      if (config.appToken && config.tableId) {
        // 获取原始表格数据
        const tableData = await fetchFeishuTableData({
          appToken: config.appToken,
          tableId: config.tableId,
          viewId: config.viewId
        });

        // 转换为时间轴项目
        const timelineItems = convertToTimelineItems(tableData, {
          titleField: config.titleField || 'name',
          dateField: config.dateField || 'date',
          groupField: config.groupField,
          descriptionField: config.descriptionField,
          colorField: config.colorField
        });

        setItems(timelineItems);
        setGroups(extractGroups(timelineItems));
      } else {
        // 开发和测试阶段：使用模拟数据
        console.log('Using mock data for timeline display');
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // 使用模拟数据
        setItems(mockTimelineItems);
        setGroups(mockGroups as string[]);
        setError(null); // 清除错误状态
      }

    } catch (err) {
      console.error('Failed to fetch timeline data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      // 如果API调用失败，回退到使用模拟数据
      console.log('Falling back to mock data due to API error');
      setItems(mockTimelineItems);
      setGroups(mockGroups as string[]);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // 获取表格列表
  const fetchTables = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const tablesList = await fetchTablesList();
      setTables(tablesList);
    } catch (err) {
      console.error('Failed to fetch tables list:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tables');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 获取字段信息
  const fetchFields = useCallback(async () => {
    if (!config.appToken || !config.tableId) {
      setError('Missing required configuration: appToken and tableId');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fieldsList = await fetchTableFields({
        appToken: config.appToken,
        tableId: config.tableId
      });
      setFields(fieldsList);
    } catch (err) {
      console.error('Failed to fetch fields:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fields');
    } finally {
      setIsLoading(false);
    }
  }, [config.appToken, config.tableId]);

  // 数据变化时自动刷新
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    groups,
    tables,
    fields,
    isLoading,
    error,
    refreshData: fetchData,
    fetchTables,
    fetchFields
  };
};

export default useTimelineData;