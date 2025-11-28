import { DashboardState, bitable, dashboard } from "@lark-base-open/js-sdk";
import React from "react";
import { useLayoutEffect, useState } from "react";

function updateTheme(theme: string) {
  document.body.setAttribute('theme-mode', theme);
}

/** 跟随主题色变化 */
export function useTheme() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  
  useLayoutEffect(() => {
    dashboard.getTheme().then((res) => {
      setBgColor(res.chartBgColor);
      const mode = res.theme.toLocaleLowerCase() as 'light' | 'dark';
      setThemeMode(mode);
      updateTheme(mode);
    })

    dashboard.onThemeChange((res) => {
      setBgColor(res.data.chartBgColor);
      const mode = res.data.theme.toLocaleLowerCase() as 'light' | 'dark';
      setThemeMode(mode);
      updateTheme(mode);
    })
  }, [])
  
  return {
    bgColor,
    themeMode,
    isDarkMode: themeMode === 'dark'
  }
}

/** 时间轴组件专用主题钩子 */
export function useTimelineTheme() {
  const baseTheme = useTheme();
  const [themeColors, setThemeColors] = useState({
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    textPrimary: '#333333',
    textSecondary: '#666666',
    borderColor: '#e8e8e8',
    bgColor: '#ffffff',
    cardBg: '#ffffff'
  });
  
  useLayoutEffect(() => {
    // 根据主题模式更新颜色
    if (baseTheme.isDarkMode) {
      setThemeColors({
        primary: '#40a9ff',
        success: '#73d13d',
        warning: '#ffc53d',
        error: '#ff4d4f',
        textPrimary: '#ffffff',
        textSecondary: '#cccccc',
        borderColor: '#333333',
        bgColor: '#141414',
        cardBg: '#1f1f1f'
      });
    } else {
      setThemeColors({
        primary: '#1890ff',
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d',
        textPrimary: '#333333',
        textSecondary: '#666666',
        borderColor: '#e8e8e8',
        bgColor: '#ffffff',
        cardBg: '#ffffff'
      });
    }
  }, [baseTheme.isDarkMode]);
  
  return {
    ...baseTheme,
    themeColors,
    // 生成分组颜色
    getGroupColor: (groupName: string, index: number = 0) => {
      const colors = [themeColors.primary, themeColors.success, themeColors.warning, themeColors.error];
      if (!groupName) return colors[index % colors.length];
      
      // 根据分组名称生成一致的颜色
      let hash = 0;
      for (let i = 0; i < groupName.length; i++) {
        hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    }
  };
}

/** 初始化、更新config */
export function useConfig(updateConfig: (data: any) => void) {

  const isCreate = dashboard.state === DashboardState.Create
  React.useEffect(() => {
    if (isCreate) {
      return
    }
    // 初始化获取配置
    dashboard.getConfig().then(updateConfig);
  }, []);


  React.useEffect(() => {
    const offConfigChange = dashboard.onConfigChange((r) => {
      // 监听配置变化，协同修改配置
      updateConfig(r.data);
    });
    return () => {
      offConfigChange();
    }
  }, []);
}