import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// 临时使用any类型导入semi-ui组件
const Select: any = require('@douyinfe/semi-ui').Select;
const Form: any = require('@douyinfe/semi-ui').Form;
const Button: any = require('@douyinfe/semi-ui').Button;
const Spin: any = require('@douyinfe/semi-ui').Spin;
// 临时使用any类型解决类型问题
type AnySelectProps = any;
import styles from './configPanelStyles.module.scss';
import useTimelineData from '../../hooks/useTimelineData';
import { useTimelineTheme } from '../../hooks';

interface TimelineConfigPanelProps {
  config: {
    appToken: string;
    tableId: string;
    viewId?: string;
    titleField: string;
    dateField: string;
    groupField?: string;
    descriptionField?: string;
    colorField?: string;
    selectedGroup?: string;
  };
  onConfigChange: (config: any) => void;
}

const TimelineConfigPanel: React.FC<TimelineConfigPanelProps> = ({ config, onConfigChange }) => {
  const { t } = useTranslation();
  const theme = useTimelineTheme();
  const timelineData = useTimelineData({}); // 初始不传入配置，只用于获取表格列表

  // 组件挂载时获取表格列表
  useEffect(() => {
    timelineData.fetchTables();
  }, []);

  // 监听表格选择变化，获取字段列表
  useEffect(() => {
    if (config.appToken && config.tableId) {
      fieldData.fetchFields();
    }
  }, [config.appToken, config.tableId]);

  // 获取字段数据的单独实例
  const fieldData = useTimelineData(config);

  const handleTableChange = (value: string) => {
    if (value) {
      const [appToken, tableId] = value.split('|');
      onConfigChange({
        ...config,
        appToken,
        tableId,
        titleField: '',
        dateField: '',
        groupField: undefined,
        descriptionField: undefined,
        colorField: undefined
      });
    }
  };

  const handleFieldChange = (fieldName: string, value: string | undefined) => {
    onConfigChange({
      ...config,
      [fieldName]: value || undefined
    });
  };

  // 构建表格选择选项
  const tableOptions = timelineData.tables.map(table => ({
    label: table.tableName,
    value: `${table.appToken}|${table.tableId}`
  }));

  // 过滤出适合不同用途的字段
  const textFields = fieldData.fields.filter(f => f.type === 'text' || f.type === 'title');
  const dateFields = fieldData.fields.filter(f => f.type === 'date' || f.type === 'datetime');
  const allFields = fieldData.fields;
  const selectFields = fieldData.fields.filter(f => f.type === 'select');
  const colorFields = fieldData.fields.filter(f => f.type === 'color');

  const fieldOptions = allFields.map(f => ({ label: f.name, value: f.name }));
  const textFieldOptions = textFields.map(f => ({ label: f.name, value: f.name }));
  const dateFieldOptions = dateFields.map(f => ({ label: f.name, value: f.name }));
  const groupFieldOptions = selectFields.map(f => ({ label: f.name, value: f.name }));
  const colorFieldOptions = colorFields.map(f => ({ label: f.name, value: f.name }));

  return (
    <div className={styles.configPanel} style={{ backgroundColor: theme?.bgColor || '#ffffff', borderColor: theme?.themeColors?.borderColor || '#d9d9d9' }}>
      <h3 className={styles.panelTitle} style={{ color: theme?.themeColors?.textPrimary || '#262626' }}>{t('config.title')}</h3>
      
      <Form layout="vertical">
        <Form.Item label={t('config.table')}>
          <Select
                placeholder={t('config.selectTable')}
                options={tableOptions}
                value={config.appToken && config.tableId ? `${config.appToken}|${config.tableId}` : undefined}
                onChange={(value: any) => handleTableChange(value || '')}
                loading={timelineData.isLoading}
                theme={theme?.themeMode}
              /> as AnySelectProps
        </Form.Item>

        {config.appToken && config.tableId && (
          <>
            <Form.Item label={t('config.titleField')}>
              <Select
                    placeholder={t('config.selectTitleField')}
                    options={textFieldOptions}
                    value={config.titleField}
                    onChange={(value: any) => handleFieldChange('titleField', value || '')}
                    loading={fieldData.isLoading}
                    theme={theme?.themeMode}
                  /> as AnySelectProps
            </Form.Item>

            <Form.Item label={t('config.dateField')}>
              <Select
                    placeholder={t('config.selectDateField')}
                    options={dateFieldOptions}
                    value={config.dateField}
                    onChange={(value: any) => handleFieldChange('dateField', value || '')}
                    loading={fieldData.isLoading}
                    theme={theme?.themeMode}
                  /> as AnySelectProps
            </Form.Item>

            <Form.Item label={t('config.groupField')}>
              <Select
                    placeholder={t('config.selectGroupField')}
                    options={groupFieldOptions}
                    value={config.groupField}
                    onChange={(value: any) => handleFieldChange('groupField', value || '')}
                    loading={fieldData.isLoading}
                    allowClear
                    theme={theme?.themeMode}
                  /> as AnySelectProps
            </Form.Item>

            <Form.Item label={t('config.descriptionField')}>
              <Select
                    placeholder={t('config.selectDescriptionField')}
                    options={textFieldOptions}
                    value={config.descriptionField}
                    onChange={(value: any) => handleFieldChange('descriptionField', value || '')}
                    loading={fieldData.isLoading}
                    allowClear
                    theme={theme?.themeMode}
                  /> as AnySelectProps
            </Form.Item>

            <Form.Item label={t('config.colorField')}>
              <Select
                    placeholder={t('config.selectColorField')}
                    options={colorFieldOptions.length > 0 ? colorFieldOptions : fieldOptions}
                    value={config.colorField}
                    onChange={(value: any) => handleFieldChange('colorField', value || '')}
                    loading={fieldData.isLoading}
                    allowClear
                    theme={theme?.themeMode}
                  /> as AnySelectProps
            </Form.Item>
          </>
        )}

        {timelineData.isLoading && <Spin size="small" />}
        {timelineData.error && (
          <div className={styles.errorText} style={{ color: theme?.themeColors?.error || '#ff4d4f' }}>
            {t('config.error')}: {timelineData.error}
          </div>
        )}
      </Form>
    </div>
  );
};

export default TimelineConfigPanel;