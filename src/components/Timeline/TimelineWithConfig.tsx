import React, { useState } from 'react';
// 临时使用any类型解决类型问题
type AnySelectProps = any;
import Timeline, { TimelineItem } from './index';
import ConfigPanel from './ConfigPanel';
// 临时使用any类型导入semi-ui组件
const Select: any = require('@douyinfe/semi-ui').Select;
const Spin: any = require('@douyinfe/semi-ui').Spin;
const Alert: any = require('@douyinfe/semi-ui').Alert;
const Button: any = require('@douyinfe/semi-ui').Button;
const Typography: any = require('@douyinfe/semi-ui').Typography;
const Space: any = require('@douyinfe/semi-ui').Space;
import styles from './timelineWithConfigStyles.module.scss';
import useTimelineData from '../../hooks/useTimelineData';
import { useTranslation } from 'react-i18next';
import { useTimelineTheme } from '../../hooks';

interface TimelineWithConfigProps {
  initialConfig?: {
    appToken?: string;
    tableId?: string;
    viewId?: string;
    titleField?: string;
    dateField?: string;
    groupField?: string;
    descriptionField?: string;
    colorField?: string;
    selectedGroup?: string;
  };
  showConfig?: boolean;
}

const TimelineWithConfig: React.FC<TimelineWithConfigProps> = ({
  initialConfig = {},
  showConfig = true
}) => {
  const { t } = useTranslation();
  const theme = useTimelineTheme();
  
  // 默认配置
  const defaultConfig = {
    appToken: '',
    tableId: '',
    viewId: '',
    titleField: '',
    dateField: '',
    groupField: undefined,
    descriptionField: undefined,
    colorField: undefined,
    selectedGroup: undefined,
    ...initialConfig
  };

  const [config, setConfig] = useState(defaultConfig);
  const [selectedGroup, setSelectedGroup] = useState(defaultConfig.selectedGroup);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);

  // 使用自定义钩子获取数据
  const { items, groups, isLoading, error, refreshData } = useTimelineData(config);

  // 处理配置变化
  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
    // 如果更改了表格或字段配置，重置选中的分组
    if (newConfig.selectedGroup !== undefined) {
      setSelectedGroup(newConfig.selectedGroup);
    }
    // 重置选中项
    setSelectedItem(null);
  };

  // 处理分组选择
  const handleGroupChange = (value: string | undefined) => {
    setSelectedGroup(value || '');
    setConfig({ ...config, selectedGroup: value || '' });
    setSelectedItem(null); // 重置选中项
  };

  // 处理时间节点点击
  const handleItemClick = (item: TimelineItem) => {
    console.log('Item clicked:', item);
    // 可以在这里添加点击事件处理，比如打开详情弹窗等
  };

  // 处理时间节点悬停
  const handleItemHover = (item: TimelineItem, hovering: boolean) => {
    console.log('Item hovered:', hovering, item);
  };
  
  // 处理选中项变更
  const handleSelectItem = (itemId: string | null) => {
    setSelectedItem(itemId);
  };

  return (
    <div className={styles.container} style={{ backgroundColor: theme.bgColor, color: theme.themeColors.textPrimary }}>
      {showConfig && (
        <div className={styles.configSection}>
          <ConfigPanel config={config} onConfigChange={handleConfigChange} />
        </div>
      )}
      
      <div className={styles.timelineSection}>
          {isLoading && (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          )}

          {error && (
            <Alert
              type="error"
              message={t('timeline.error')}
              description={error}
              showIcon
              closable
              style={{ marginBottom: '16px' }}
            />
          )}

          {!isLoading && !error && (
            <>
              {/* 控制选项 */}
              <div className={styles.controlOptions}>
                {groups.length > 0 && (
                  <Select
                    placeholder={t('timeline.filterGroup')}
                    options={groups.map(group => ({ label: group, value: group }))}
                    value={selectedGroup}
                    onChange={(value: any) => handleGroupChange(value || '')}
                    allowClear
                    style={{ marginRight: 12, width: '200px' }}
                  /> as AnySelectProps
                )}
                <Space>
                  <Button
                    size="small"
                    onClick={() => setShowLabels(!showLabels)}
                  >
                    {t('timeline.showLabels')}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setShowMilestones(!showMilestones)}
                  >
                    {t('timeline.showMilestones')}
                  </Button>
                  <Button 
                    onClick={refreshData} 
                  >
                    {t('timeline.refresh')}
                  </Button>
                </Space>
              </div>
              
              {/* 选中项信息 */}
              {selectedItem && (
                <div className={styles.selectedItemInfo}>
                  <Typography.Text type="secondary">
                    {t('timeline.selectedItem')}: {selectedItem}
                  </Typography.Text>
                </div>
              )}
              
              <Timeline
                items={items}
                groups={groups}
                selectedGroup={selectedGroup}
                selectedItem={selectedItem}
                onSelectItem={handleSelectItem}
                onItemClick={handleItemClick}
                onItemHover={handleItemHover}
                showLabels={showLabels}
                showMilestones={showMilestones}
              />
            </>
          )}
      </div>
    </div>
  );
};

export default TimelineWithConfig;