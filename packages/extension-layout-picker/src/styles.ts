/**
 * Layout Picker styles
 * These styles should be included in your application
 */
export const layoutPickerStyles = `
/* Layout Picker Styles */
.layout-picker-placeholder-wrapper {
  margin: 24px 0;
}

.layout-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  gap: 20px;
  width: 100%;
}

.layout-picker-header {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--editor-fg-secondary, #6b7280);
  text-align: left;
}

.layout-picker-templates {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.layout-template {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 16px;
  min-width: 120px;
  border: 2px solid var(--slide-border, #e5e7eb);
  border-radius: 12px;
  background-color: var(--slide-bg, #f9fafb);
  cursor: pointer;
  transition: all 0.2s ease;
}

.layout-template:hover {
  border-color: var(--editor-selection, #3b82f6);
  background-color: var(--editor-hover, #ffffff);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.layout-template:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.layout-template-icon {
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layout-template-icon svg {
  width: 100%;
  height: 100%;
  max-width: 80px;
}

.layout-template-label {
  font-size: 12px;
  color: var(--editor-fg, #4b5563);
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
}
`;
