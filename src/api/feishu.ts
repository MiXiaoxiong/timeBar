// 飞书API服务

// 添加window对象的lark属性类型定义
declare global {
  interface Window {
    lark?: {
      bridge?: {
        call: (method: string, params: any) => Promise<any>;
      };
    };
  }
}

// 飞书多维表格API响应类型
interface FeishuTableResponse {
  code: number;
  data: {
    items: {
      fields: Record<string, any>;
      record_id: string;
    }[];
  };
  msg: string;
}

// 多维表格配置
interface TableConfig {
  appToken: string;
  tableId: string;
  viewId?: string;
}

/**
 * 从飞书多维表格获取数据
 * @param config 多维表格配置
 * @returns 表格数据数组
 */
export const fetchFeishuTableData = async (config: TableConfig): Promise<any[]> => {
  try {
    // 检查是否在飞书环境中
    if (!window.lark || !window.lark.bridge) {
      throw new Error('Not in Feishu environment');
    }

    // 构建API路径
    const path = `https://open.feishu.cn/open-apis/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records`;
    const params = config.viewId ? { view_id: config.viewId } : {};

    // 使用飞书桥接调用API
    const response: FeishuTableResponse = await window.lark.bridge.call('request', {
      url: path,
      method: 'GET',
      params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {{token}}', // 飞书会自动填充token
      },
    });

    // 检查响应
    if (response.code !== 0) {
      throw new Error(`Feishu API error: ${response.msg}`);
    }

    // 转换数据格式
    return response.data.items.map(item => ({
      _id: item.record_id,
      ...item.fields
    }));

  } catch (error) {
    console.error('Error fetching Feishu table data:', error);
    // 返回mock数据以便开发和测试
    return getMockData();
  }
};

/**
 * 获取所有多维表格列表
 * @returns 表格列表
 */
export const fetchTablesList = async (): Promise<Array<{appToken: string, tableId: string, tableName: string}>> => {
  try {
    if (!window.lark || !window.lark.bridge) {
      throw new Error('Not in Feishu environment');
    }

    // 调用飞书API获取多维表格列表
    const response = await window.lark.bridge.call('request', {
      url: 'https://open.feishu.cn/open-apis/bitable/v1/apps',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {{token}}',
      },
    });

    if (response.code !== 0) {
      throw new Error(`Feishu API error: ${response.msg}`);
    }

    // 简化处理，实际可能需要更复杂的逻辑
    return response.data.items.map((app: any) => ({
      appToken: app.app_token,
      tableId: app.tables?.[0]?.table_id || '',
      tableName: app.name || 'Unknown Table'
    })).filter(table => table.tableId);

  } catch (error) {
    console.error('Error fetching tables list:', error);
    // 返回mock表格列表
    return getMockTables();
  }
};

/**
 * 获取表格字段信息
 * @param config 表格配置
 * @returns 字段信息数组
 */
export const fetchTableFields = async (config: TableConfig): Promise<Array<{name: string, type: string}>> => {
  try {
    if (!window.lark || !window.lark.bridge) {
      throw new Error('Not in Feishu environment');
    }

    const path = `https://open.feishu.cn/open-apis/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/fields`;

    const response = await window.lark.bridge.call('request', {
      url: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {{token}}',
      },
    });

    if (response.code !== 0) {
      throw new Error(`Feishu API error: ${response.msg}`);
    }

    return response.data.items.map((field: any) => ({
      name: field.name,
      type: field.type
    }));

  } catch (error) {
    console.error('Error fetching table fields:', error);
    // 返回mock字段信息
    return getMockFields();
  }
};

/**
 * Mock数据 - 用于开发和测试
 */
const getMockData = (): any[] => {
  return [
    {
      _id: 'rec_1',
      name: '项目启动',
      date: '2024-01-15',
      group: '需求阶段',
      description: '项目正式启动，确定项目范围和目标',
      status: '已完成'
    },
    {
      _id: 'rec_2',
      name: '需求评审',
      date: '2024-01-20',
      group: '需求阶段',
      description: '对需求文档进行评审和确认',
      status: '已完成'
    },
    {
      _id: 'rec_3',
      name: '设计完成',
      date: '2024-02-10',
      group: '设计阶段',
      description: 'UI/UX设计和技术方案设计完成',
      status: '进行中'
    },
    {
      _id: 'rec_4',
      name: '开发启动',
      date: '2024-02-15',
      group: '开发阶段',
      description: '开始前后端开发工作',
      status: '进行中'
    },
    {
      _id: 'rec_5',
      name: '开发完成',
      date: '2024-03-20',
      group: '开发阶段',
      description: '所有功能开发完成',
      status: '未开始'
    },
    {
      _id: 'rec_6',
      name: '测试开始',
      date: '2024-03-25',
      group: '测试阶段',
      description: '进行全面测试',
      status: '未开始'
    },
    {
      _id: 'rec_7',
      name: '项目上线',
      date: '2024-04-10',
      group: '发布阶段',
      description: '项目正式上线',
      status: '未开始'
    }
  ];
};

/**
 * Mock表格列表
 */
const getMockTables = (): Array<{appToken: string, tableId: string, tableName: string}> => {
  return [
    {
      appToken: 'mock_app_token_1',
      tableId: 'mock_table_id_1',
      tableName: '项目时间线'
    },
    {
      appToken: 'mock_app_token_2',
      tableId: 'mock_table_id_2',
      tableName: '任务跟踪'
    }
  ];
};

/**
 * Mock字段信息
 */
const getMockFields = (): Array<{name: string, type: string}> => {
  return [
    { name: 'name', type: 'text' },
    { name: 'date', type: 'date' },
    { name: 'group', type: 'select' },
    { name: 'description', type: 'text' },
    { name: 'status', type: 'select' }
  ];
};