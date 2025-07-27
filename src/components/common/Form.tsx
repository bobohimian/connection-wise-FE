import { useCallback, useMemo, useState } from "react";

/** 表单字段类型 */
type FieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'date'

/**
 * 表单字段配置接口
 */
interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  patternMessage?: string;
  inputProps?: Record<string, any>;
  validate?: (value: string | number, formData: Record<string, string | number>) => string | null; // 自定义验证函数（返回错误信息或 null）
}
/**
 * 表单组件属性接口
 */
interface FormProps {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, string | number>) => Promise<void>;
  initialValues?: Record<string, string | number>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  submitButtonText?: string;
  // onReset?: () => void;
  formProps?: Record<string, any>;
}
/**
 * 通用表单组件
 * @param fields - 表单字段配置数组
 * @param onSubmit - 表单提交处理函数
 * @param initialValues - 表单初始值
 * @param validateOnChange - 是否在输入时进行验证
 * @param validateOnBlur - 是否在失焦时进行验证
 * @param submitButtonText - 提交按钮文本
 * @param formProps - 其他表单属性
 * @returns 表单组件
 */
const Form = ({
  fields = [],
  onSubmit = async () => { },
  initialValues = {},
  validateOnChange = true,
  validateOnBlur = true,
  submitButtonText = '提交',
  ...formProps
  // onReset,
}: FormProps) => {
  // 初始化表单数据
  const [formData, setFormData] = useState<Record<string, string | number>>(initialValues);
  // 字段错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 提交状态
  const [loading, setLoading] = useState<boolean>(false);
  // 字段配置
  const fieldsConfig = useMemo(() => {
    return new Map<string, FieldConfig>(fields.map(field => [field.name, field]));
  }, [fields])

  const validateField = (fieldName: string, value: string | number) => {
    const fieldConfig = fieldsConfig.get(fieldName);
    if (!fieldConfig) {
      return null;
    }
    // 1. 必填
    if (fieldConfig.required && !value) {
      return '必填';
    }
    // 2. 长度--字符串
    if (typeof value === 'string') {
      if (fieldConfig.minLength && value.length < fieldConfig.minLength) {
        return '长度必须大于等于' + fieldConfig.minLength + '个字符';
      }
      if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
        return '长度必须小于等于' + fieldConfig.maxLength + '个字符';
      }
    }
    // 3. 最小最小值--数字
    if (typeof value === 'number') {
      if (fieldConfig.min && value < fieldConfig.min) {
        return '数值不得小于' + fieldConfig.min;
      }
      if (fieldConfig.max && value > fieldConfig.max) {
        return '数值不得大于' + fieldConfig.max;
      }
    }
    // 4. 正则
    if (fieldConfig.pattern && !fieldConfig.pattern.test(value.toString())) {
      return fieldConfig?.patternMessage || '格式错误';
    }
    // 5. 自定义验证
    if (fieldConfig.validate) {
      const errorMessage = fieldConfig.validate(value, formData);
      return errorMessage;
    }
    return null;
  }

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error)
        newErrors[field.name] = error;
    })
    return newErrors;
  }, [fieldsConfig, formData, validateField])

  const handleChange = useCallback((fileName: string, value: string | number) => {
    setFormData(prevData => ({
      ...prevData,
      [fileName]: value,
    }));
    if (validateOnChange) {
      const error = validateField(fileName, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [fileName]: error,
      }));
    }
  }, [fieldsConfig, validateOnChange])

  const handleFocus = useCallback((fieldName: string) => {
    // 聚焦时清除错误信息
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  }, [])
  const handleBlur = useCallback((fieldName: string) => {
    // 失焦时校验
    if (validateOnBlur) {
      const value = formData[fieldName];
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [formData, validateOnBlur, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }
    else {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    }
  }, [formData, onSubmit, validateForm])
  return <>
    <form onSubmit={handleSubmit} className="px-8 flex flex-col space-y-4 mt-4 mb-6" noValidate {...formProps}>
      {fields.map(field => {
        const value = formData[field.name] || '';
        const error = errors[field.name];
        const fieldConfig = fieldsConfig.get(field.name);
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-2 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              onFocus={() => handleFocus(field.name)}
              // 默认情况有border,添加ring的时候，将border与ring设置为相同的颜色
              {...fieldConfig?.inputProps}
              className={`w-full py-3 px-4 border ${error ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'} rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-100
               ${fieldConfig?.inputProps?.className}`}
            />
            <div className="mt-2 text-sm text-red-500 h-2">{error ? error : ' '}</div>
          </div>
        )
      })}
      <button
        type="submit"
        className={`w-full flex items-center justify-center space-x-3 py-3 px-4 bg-indigo-500 rounded-lg text-white font-medium transition-colors hover:bg-indigo-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span>{submitButtonText}</span>
        )}
      </button>
    </form >
  </>
}
export default Form
