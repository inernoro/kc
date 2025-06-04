// 产品部门模块导出
export { default as FeatureRoadmap } from './FeatureRoadmap';
export { default as UserFeedback } from './UserFeedback';
export { default as AnalyticsDashboard } from './AnalyticsDashboard';
export { default as ABTesting } from './ABTesting';
export { default as ReleaseNotes } from './ReleaseNotes';
export { default as CompetitorAnalysis } from './CompetitorAnalysis';

// 部门专用工具和钩子
export { useProductAnalytics } from './hooks/useProductAnalytics';
export { useFeatureToggle } from './hooks/useFeatureToggle';
export { useUserFeedback } from './hooks/useUserFeedback';
export { productUtils } from './utils/productUtils'; 