import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, CreditCard, Package, Star, Truck, MessageCircle, Users, Clock, Gift, Globe, 
  Percent, Award, ArrowUpDown, Link, Smartphone, Plus, Filter, Eye, ChevronDown, ChevronUp, 
  Edit, Trash, Save, X, Crown, Settings, Download, Upload, Loader 
} from 'lucide-react';

// Supabase 配置
const SUPABASE_URL = 'https://aixsyqgmkogxmnhmweil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeHN5cWdta29neG1uaG13ZWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDU0NjksImV4cCI6MjA2NTYyMTQ2OX0.JW6TjsAHiuD5DzIg311BawiO2FLMIcnGz7gfTDdjo7k';

// 简化的 Supabase 客户端
class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async request(path, options = {}) {
    const url = `${this.url}/rest/v1${path}`;
    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async getPlatforms() {
    return this.request('/platforms?select=*&order=id');
  }

  async createPlatform(platform) {
    return this.request('/platforms', {
      method: 'POST',
      body: JSON.stringify(platform),
      headers: { 'Prefer': 'return=representation' }
    });
  }

  async deletePlatform(id) {
    return this.request(`/platforms?id=eq.${id}`, { method: 'DELETE' });
  }

  async getPlatformData() {
    return this.request('/platform_data?select=*');
  }

  async upsertPlatformData(sectionKey, platformId, data) {
    const existing = await this.request(`/platform_data?section_key=eq.${sectionKey}&platform_id=eq.${platformId}&select=id`);
    
    if (existing && existing.length > 0) {
      return this.request(`/platform_data?id=eq.${existing[0].id}`, {
        method: 'PATCH',
        body: JSON.stringify({ data, updated_at: new Date().toISOString() })
      });
    } else {
      return this.request('/platform_data', {
        method: 'POST',
        body: JSON.stringify({ section_key: sectionKey, platform_id: platformId, data })
      });
    }
  }

  async getAdvantagePlatforms() {
    return this.request('/advantage_platforms?select=*');
  }

  async upsertAdvantagePlatforms(sectionKey, platformIds) {
    const existing = await this.request(`/advantage_platforms?section_key=eq.${sectionKey}&select=id`);
    
    if (existing && existing.length > 0) {
      return this.request(`/advantage_platforms?id=eq.${existing[0].id}`, {
        method: 'PATCH',
        body: JSON.stringify({ platform_ids: platformIds, updated_at: new Date().toISOString() })
      });
    } else {
      return this.request('/advantage_platforms', {
        method: 'POST',
        body: JSON.stringify({ section_key: sectionKey, platform_ids: platformIds })
      });
    }
  }

  // 新增：板块配置相关API
  async getSectionConfigs() {
    return this.request('/section_configs?select=*&order=display_order');
  }

  async createSectionConfig(config) {
    return this.request('/section_configs', {
      method: 'POST',
      body: JSON.stringify(config),
      headers: { 'Prefer': 'return=representation' }
    });
  }

  async deleteSectionConfig(sectionKey) {
    return this.request(`/section_configs?section_key=eq.${sectionKey}`, { method: 'DELETE' });
  }

  // 新增：字段配置相关API
  async getFieldConfigs() {
    return this.request('/field_configs?select=*&order=section_key,display_order');
  }

  async createFieldConfig(config) {
    return this.request('/field_configs', {
      method: 'POST',
      body: JSON.stringify(config),
      headers: { 'Prefer': 'return=representation' }
    });
  }

  async deleteFieldConfig(sectionKey, fieldKey) {
    return this.request(`/field_configs?section_key=eq.${sectionKey}&field_key=eq.${fieldKey}`, { method: 'DELETE' });
  }

  async uploadImage(file, path) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.url}/storage/v1/object/platform-images/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.key}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('图片上传失败');
    }

    return `${this.url}/storage/v1/object/public/platform-images/${path}`;
  }

  async deleteImage(path) {
    await fetch(`${this.url}/storage/v1/object/platform-images/${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.key}`,
      }
    });
  }
}

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function App() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editPlatformId, setEditPlatformId] = useState(null);
  const [newPlatform, setNewPlatform] = useState({ name: '', url: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [advantagePlatforms, setAdvantagePlatforms] = useState({});
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [platformData, setPlatformData] = useState({});
  const [sectionConfigs, setSectionConfigs] = useState({});
  const [fieldConfigs, setFieldConfigs] = useState({});
  const [showNewSectionModal, setShowNewSectionModal] = useState(false);
  const [newSection, setNewSection] = useState({ key: '', label: '', icon: 'Package' });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 显示成功提示
  const showToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // 可选图标列表
  const iconOptions = [
    { value: 'CreditCard', label: '信用卡', component: CreditCard },
    { value: 'Package', label: '包裹', component: Package },
    { value: 'Star', label: '星星', component: Star },
    { value: 'Truck', label: '卡车', component: Truck },
    { value: 'MessageCircle', label: '消息', component: MessageCircle },
    { value: 'Users', label: '用户', component: Users },
    { value: 'Clock', label: '时钟', component: Clock },
    { value: 'Gift', label: '礼物', component: Gift },
    { value: 'Globe', label: '全球', component: Globe },
    { value: 'Percent', label: '百分比', component: Percent },
    { value: 'Award', label: '奖励', component: Award },
    { value: 'Link', label: '链接', component: Link },
    { value: 'Smartphone', label: '手机', component: Smartphone },
    { value: 'Settings', label: '设置', component: Settings }
  ];

  // 字段类型中文映射
  const fieldTypeLabels = {
    'method': '验证方式',
    'issues': '体验问题',
    'verificationInterface': '验证界面',
    'image': '图片',
    'creditCard': '信用卡/借记卡',
    'eWallet': '电子钱包',
    'regional': '地区特色',
    'other': '其他',
    'free': '免费保管期',
    'extended': '延长存储',
    'extra': '额外QC价格',
    'quality': '照片质量',
    'rehearsal': '预演包裹费',
    'seizure': '海关扣押险',
    'loss': '丢失/损坏险',
    'delay': '延迟险',
    'hours': '工作时间',
    'days': '工作日',
    'response': '响应时间',
    'members': '社区人数',
    'activities': '活动频率',
    'rewards': '奖励形式',
    'referral': '拉新奖励',
    'dcLink': 'DC链接',
    'accept': '接单时间',
    'purchase': '采购时间',
    'shipping': '卖家发货',
    'arrival': '到仓时间',
    'qc': '质检上架',
    'amount': '优惠金额',
    'type': '券码类型',
    'threshold': '使用门槛',
    'maxDiscount': '最高折扣',
    'stackable': '叠加使用',
    'languages': '支持语言',
    'currencies': '支持货币',
    'base': '基础佣金',
    'max': '最高佣金',
    'mechanism': '计算机制',
    'points': '积分获取',
    'usage': '积分使用',
    'special': '特色功能',
    'address': '转运地址',
    'requirements': '信息要求',
    'platforms': '支持平台',
    'systems': '支持系统',
    'size': '安装包大小',
    'features': '特色功能',
    'paid': '收费服务',
    'hasService': '是否有定制物流',
    'needInfo': '需要填写的信息',
    'tips': '提示信息',
    'feeDescription': '费用说明',
    'displayInterface': '展示界面',
    'returnFee': '商品退换货费用',
    'returnTime': '商品退换货官方时效',
    'processingTime': '包裹售后处理时间'
  };

  const getFieldLabel = (fieldKey) => {
    return fieldTypeLabels[fieldKey] || fieldKey;
  };

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.component : Package;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log('Loading data...');
    try {
      setLoading(true);
      
      // 加载平台数据
      const platformsData = await supabase.getPlatforms();
      setPlatforms(platformsData || []);
      setSelectedPlatforms((platformsData || []).map(p => p.id));

      // 加载板块配置
      const sectionsData = await supabase.getSectionConfigs();
      const sectionsConfig = {};
      if (sectionsData) {
        sectionsData.forEach(section => {
          sectionsConfig[section.section_key] = {
            label: section.label,
            icon: getIconComponent(section.icon_name),
            displayOrder: section.display_order
          };
        });
      }
      setSectionConfigs(sectionsConfig);

      // 加载字段配置
      const fieldsData = await supabase.getFieldConfigs();
      const fieldsConfig = {};
      if (fieldsData) {
        fieldsData.forEach(field => {
          if (!fieldsConfig[field.section_key]) {
            fieldsConfig[field.section_key] = {};
          }
          fieldsConfig[field.section_key][field.field_key] = {
            label: field.label,
            type: field.field_type,
            displayOrder: field.display_order
          };
        });
      }
      setFieldConfigs(fieldsConfig);

      // 加载平台数据
      const platformDataRows = await supabase.getPlatformData();
      const formattedData = {};
      
      Object.keys(sectionsConfig).forEach(sectionKey => {
        formattedData[sectionKey] = {
          label: sectionsConfig[sectionKey].label,
          icon: sectionsConfig[sectionKey].icon,
          data: {}
        };
        (platformsData || []).forEach(platform => {
          formattedData[sectionKey].data[platform.id] = {};
          // 根据字段配置初始化数据
          if (fieldsConfig[sectionKey]) {
            Object.keys(fieldsConfig[sectionKey]).forEach(fieldKey => {
              formattedData[sectionKey].data[platform.id][fieldKey] = '';
            });
          }
        });
      });

      if (platformDataRows) {
        platformDataRows.forEach(row => {
          if (formattedData[row.section_key]) {
            formattedData[row.section_key].data[row.platform_id] = { ...row.data };
          }
        });
      }
      console.log('Loaded platformData:', formattedData);
      setPlatformData(formattedData);

      // 加载优势标记
      const advantageData = await supabase.getAdvantagePlatforms();
      const formattedAdvantage = {};
      if (advantageData) {
        advantageData.forEach(row => {
          formattedAdvantage[row.section_key] = row.platform_ids || [];
        });
      }
      setAdvantagePlatforms(formattedAdvantage);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('数据加载失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminModal(false);
    } else {
      alert('密码错误！');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setEditMode(null);
    setEditPlatformId(null);
  };

  const handleAddPlatform = async () => {
    if (!newPlatform.name || !newPlatform.url) {
      showToast('请输入平台名称和URL');
      return;
    }

    try {
      const newPlatformData = await supabase.createPlatform(newPlatform);
      if (newPlatformData && newPlatformData.length > 0) {
        const created = newPlatformData[0];
        setPlatforms(prev => [...prev, created]);
        setSelectedPlatforms(prev => [...prev, created.id]);
        
        // 为新平台初始化所有板块的数据
        setPlatformData(prev => {
          const updated = { ...prev };
          Object.keys(sectionConfigs).forEach(sectionKey => {
            if (updated[sectionKey]) {
              updated[sectionKey].data[created.id] = {};
              // 根据字段配置初始化数据
              if (fieldConfigs[sectionKey]) {
                Object.keys(fieldConfigs[sectionKey]).forEach(fieldKey => {
                  updated[sectionKey].data[created.id][fieldKey] = '';
                });
              }
            }
          });
          return updated;
        });
        
        setNewPlatform({ name: '', url: '' });
        showToast('平台添加成功！');
      }
    } catch (error) {
      console.error('添加平台失败:', error);
      showToast('添加平台失败');
    }
  };

  const handleDeletePlatform = async (id) => {
    const platform = platforms.find(p => p.id === id);
    if (window.confirm(`确认删除平台 ${platform.name} 吗？`)) {
      try {
        await supabase.deletePlatform(id);
        setPlatforms(prev => prev.filter(p => p.id !== id));
        setSelectedPlatforms(prev => prev.filter(pId => pId !== id));
        
        setPlatformData(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(sectionKey => {
            delete updated[sectionKey].data[id];
          });
          return updated;
        });
        
        alert('平台删除成功！');
        await loadData();
      } catch (error) {
        console.error('删除平台失败:', error);
        alert('删除平台失败');
      }
    }
  };

  const handleEditPlatform = (id, sectionKey) => {
    setEditMode(sectionKey);
    setEditPlatformId(id);
  };

  const handleSaveEdit = async (sectionKey, id, updatedData) => {
    console.log('Saving to Supabase:', { sectionKey, id, updatedData });
    try {
      await supabase.upsertPlatformData(sectionKey, id, updatedData);
      
      setPlatformData(prev => {
        const newData = { ...prev };
        newData[sectionKey].data[id] = updatedData;
        return newData;
      });
      
      setEditMode(null);
      setEditPlatformId(null);
      alert('数据保存成功！');
      await loadData();
    } catch (error) {
      console.error('保存数据失败:', error);
      alert('保存数据失败');
    }
  };

  const handleToggleAdvantage = async (sectionKey, platformId) => {
    try {
      const currentAdvantage = advantagePlatforms[sectionKey] || [];
      let newAdvantage;
      
      if (currentAdvantage.includes(platformId)) {
        newAdvantage = currentAdvantage.filter(id => id !== platformId);
      } else {
        newAdvantage = [...currentAdvantage, platformId];
      }
      
      await supabase.upsertAdvantagePlatforms(sectionKey, newAdvantage);
      
      setAdvantagePlatforms(prev => ({
        ...prev,
        [sectionKey]: newAdvantage
      }));
    } catch (error) {
      console.error('更新优势标记失败:', error);
      alert('更新优势标记失败');
    }
  };

  const handleImageUpload = async (e, sectionKey, platformId, fieldKey) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('请上传图片文件！');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB！');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionKey}_${platformId}_${fieldKey}_${Date.now()}.${fileExt}`;
      
      const imageUrl = await supabase.uploadImage(file, fileName);
      
      const currentData = { ...platformData[sectionKey].data[platformId] };
      currentData[fieldKey] = imageUrl;
      
      await supabase.upsertPlatformData(sectionKey, platformId, currentData);
      
      setPlatformData(prev => {
        const updated = { ...prev };
        updated[sectionKey].data[platformId] = currentData;
        return updated;
      });
      
      alert('图片上传成功！');
      await loadData();
    } catch (error) {
      console.error('图片上传失败:', error);
      alert('图片上传失败');
    }
  };

  const handleDeleteImage = async (sectionKey, platformId, fieldKey) => {
    if (window.confirm('确认删除这张图片吗？')) {
      try {
        const currentData = { ...platformData[sectionKey].data[platformId] };
        const oldImageUrl = currentData[fieldKey];
        
        if (oldImageUrl && oldImageUrl.includes('/platform-images/')) {
          const path = oldImageUrl.split('/platform-images/')[1];
          await supabase.deleteImage(path);
        }
        
        currentData[fieldKey] = '';
        
        await supabase.upsertPlatformData(sectionKey, platformId, currentData);
        
        setPlatformData(prev => {
          const updated = { ...prev };
          updated[sectionKey].data[platformId] = currentData;
          return updated;
        });
        
        alert('图片删除成功！');
        await loadData();
      } catch (error) {
        console.error('删除图片失败:', error);
        alert('删除图片失败');
      }
    }
  };

  // 添加新板块
  const handleAddSection = async () => {
    if (!newSection.label) {
      alert('请输入板块名称');
      return;
    }

    // 生成板块标识
    const generateSectionKey = (label) => {
      const pinyinMap = {
        '账户': 'account', '验证': 'verification', '方式': 'method', '支付': 'payment',
        '保管': 'storage', '期': 'period', '质检': 'qc', '运费': 'shipping',
        '保险': 'insurance', '客服': 'customer', '支持': 'service', '社区': 'community',
        '时效': 'timing', '优惠券': 'coupon', '语言': 'language', '货币': 'currency',
        '联盟': 'alliance', '佣金': 'commission', '会员': 'membership', '体系': 'system',
        '转运': 'forwarding', '服务': 'service', '支持': 'supported', '链接': 'link',
        '平台': 'platforms', '体验': 'experience', '增值': 'valueAdded',
        '定制': 'custom', '物流': 'logistics', '售后': 'afterSales'
      };
      
      let result = label;
      Object.keys(pinyinMap).forEach(cn => {
        result = result.replace(new RegExp(cn, 'g'), pinyinMap[cn]);
      });
      
      if (/[\u4e00-\u9fa5]/.test(result)) {
        result = `section_${Date.now()}`;
      }
      
      result = result.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      return result;
    };

    const sectionKey = generateSectionKey(newSection.label);

    try {
      const maxOrder = Math.max(...Object.values(sectionConfigs).map(s => s.displayOrder || 0), 0);
      
      await supabase.createSectionConfig({
        section_key: sectionKey,
        label: newSection.label,
        icon_name: newSection.icon,
        display_order: maxOrder + 1
      });

      setShowNewSectionModal(false);
      setNewSection({ key: '', label: '', icon: 'Package' });
      alert('板块添加成功！');
      await loadData();
    } catch (error) {
      console.error('添加板块失败:', error);
      alert('添加板块失败');
    }
  };

  // 删除板块
  const handleDeleteSection = async (sectionKey) => {
    if (window.confirm(`确认删除板块 "${sectionConfigs[sectionKey]?.label}" 吗？这将删除该板块的所有数据！`)) {
      try {
        await supabase.deleteSectionConfig(sectionKey);
        alert('板块删除成功！');
        await loadData();
      } catch (error) {
        console.error('删除板块失败:', error);
        alert('删除板块失败');
      }
    }
  };

  // 为所有平台添加字段
  const handleAddFieldToAllPlatforms = async (sectionKey, fieldKey, fieldLabel, fieldType = 'text') => {
    try {
      const maxOrder = fieldConfigs[sectionKey] 
        ? Math.max(...Object.values(fieldConfigs[sectionKey]).map(f => f.displayOrder || 0), 0)
        : 0;

      await supabase.createFieldConfig({
        section_key: sectionKey,
        field_key: fieldKey,
        label: fieldLabel,
        field_type: fieldType,
        display_order: maxOrder + 1
      });

      // 更新字段配置状态
      setFieldConfigs(prev => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [fieldKey]: {
            label: fieldLabel,
            type: fieldType,
            displayOrder: maxOrder + 1
          }
        }
      }));

      // 更新所有平台的数据
      const promises = platforms.map(platform => {
        const currentData = { ...platformData[sectionKey].data[platform.id] };
        currentData[fieldKey] = fieldType === 'image' ? '' : '';
        return supabase.upsertPlatformData(sectionKey, platform.id, currentData);
      });

      await Promise.all(promises);
      
      // 更新本地平台数据状态
      setPlatformData(prev => {
        const updated = { ...prev };
        platforms.forEach(platform => {
          if (updated[sectionKey] && updated[sectionKey].data[platform.id]) {
            updated[sectionKey].data[platform.id][fieldKey] = fieldType === 'image' ? '' : '';
          }
        });
        return updated;
      });
      
      // 移除 await loadData(); - 不需要重新加载整个页面
    } catch (error) {
      console.error('添加字段失败:', error);
      throw error;
    }
  };

  // 从所有平台删除字段
  const handleDeleteFieldFromAllPlatforms = async (sectionKey, fieldKey) => {
    if (window.confirm(`确认删除字段 "${getFieldLabel(fieldKey)}" 吗？这将从所有平台中删除该字段！`)) {
      try {
        await supabase.deleteFieldConfig(sectionKey, fieldKey);

        // 更新所有平台的数据
        const promises = platforms.map(platform => {
          const currentData = { ...platformData[sectionKey].data[platform.id] };
          delete currentData[fieldKey];
          return supabase.upsertPlatformData(sectionKey, platform.id, currentData);
        });

        await Promise.all(promises);
        await loadData();
      } catch (error) {
        console.error('删除字段失败:', error);
        alert('删除字段失败');
      }
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
        activeTab === id
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
          : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  const renderSimpleData = (data, sectionKey) => {
    console.log('Rendering data:', data, sectionKey);
    if (!data) return <span className="text-gray-400">数据缺失</span>;
    
    const fields = fieldConfigs[sectionKey] || {};
    const sortedFields = Object.entries(fields).sort((a, b) => (a[1].displayOrder || 0) - (b[1].displayOrder || 0));

    return (
      <div className="space-y-2 text-sm">
        {sortedFields.map(([fieldKey, fieldConfig]) => (
          <div key={fieldKey}>
            <span className="font-medium text-gray-700">{fieldConfig.label}：</span>
            <span className="text-gray-600">
              {Array.isArray(data[fieldKey]) ? data[fieldKey].join('、') : (data[fieldKey] || '数据缺失')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderSectionData = (sectionKey, data) => {
    console.log('Rendering data for', sectionKey, data);
    if (!data) return <span className="text-gray-400">数据缺失</span>;

    const fields = fieldConfigs[sectionKey] || {};
    const sortedFields = Object.entries(fields).sort((a, b) => (a[1].displayOrder || 0) - (b[1].displayOrder || 0));

    return (
      <div className="space-y-3 text-sm">
        {sortedFields.map(([fieldKey, fieldConfig]) => {
          if (fieldConfig.type === 'image' && data[fieldKey]) {
            return (
              <div key={fieldKey} className="mt-3 relative">
                <div className="font-medium text-gray-700 mb-2">{fieldConfig.label}：</div>
                <img
                  src={data[fieldKey]}
                  alt={`${fieldConfig.label} Image`}
                  className="h-40 w-40 object-contain rounded-lg border border-gray-200 shadow-md hover:scale-105 transition-transform cursor-pointer"
                  loading="lazy"
                  onClick={() => setPreviewImage(data[fieldKey])}
                />
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteImage(sectionKey, data.platformId, fieldKey)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title="删除图片"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          } else if (fieldConfig.type !== 'image') {
            return (
              <div key={fieldKey}>
                <span className="font-medium text-gray-700">{fieldConfig.label}：</span>
                <span className="text-gray-600">
                  {Array.isArray(data[fieldKey]) ? data[fieldKey].join('、') : (data[fieldKey] || '数据缺失')}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const EditForm = ({ sectionKey, platformId, onClose, onSave }) => {
    const [formData, setFormData] = useState(() => ({ ...platformData[sectionKey].data[platformId] }));
    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldType, setNewFieldType] = useState('text');

    const currentFields = fieldConfigs[sectionKey] || {};
    const sortedFields = Object.entries(currentFields).sort((a, b) => (a[1].displayOrder || 0) - (b[1].displayOrder || 0));

    const handleChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };

    // 生成字段标识（基于中文名称）
    const generateFieldKey = (label) => {
      // 简单的拼音映射，实际项目中可以使用更完善的拼音库
      const pinyinMap = {
        '验证': 'verification', '方式': 'method', '体验': 'experience', '问题': 'issues',
        '界面': 'interface', '保管': 'storage', '免费': 'free', '延长': 'extended',
        '价格': 'price', '质量': 'quality', '照片': 'photo', '包裹': 'package',
        '费用': 'fee', '海关': 'customs', '扣押': 'seizure', '险': 'insurance',
        '丢失': 'loss', '损坏': 'damage', '延迟': 'delay', '工作': 'work',
        '时间': 'time', '响应': 'response', '社区': 'community', '人数': 'members',
        '活动': 'activity', '频率': 'frequency', '奖励': 'reward', '形式': 'form',
        '拉新': 'referral', '链接': 'link', '接单': 'accept', '采购': 'purchase',
        '发货': 'shipping', '到仓': 'arrival', '质检': 'qc', '上架': 'listing',
        '优惠': 'discount', '金额': 'amount', '券码': 'coupon', '类型': 'type',
        '门槛': 'threshold', '最高': 'max', '折扣': 'discount', '叠加': 'stackable',
        '使用': 'usage', '语言': 'language', '货币': 'currency', '支持': 'support',
        '佣金': 'commission', '基础': 'base', '计算': 'calculation', '机制': 'mechanism',
        '积分': 'points', '获取': 'earn', '特色': 'special', '功能': 'feature',
        '转运': 'forwarding', '地址': 'address', '信息': 'info', '要求': 'requirement',
        '平台': 'platform', '系统': 'system', '安装包': 'package', '大小': 'size',
        '服务': 'service', '收费': 'paid', '运单': 'waybill', '增值': 'valueAdded',
        '定制': 'custom', '物流': 'logistics', '填写': 'fill', '提示': 'tip',
        '说明': 'description', '展示': 'display', '售后': 'afterSales',
        '退换货': 'return', '官方': 'official', '时效': 'timeLimit', '处理': 'process'
      };
      
      // 尝试转换为英文，如果没有映射就使用简化版
      let result = label;
      Object.keys(pinyinMap).forEach(cn => {
        result = result.replace(new RegExp(cn, 'g'), pinyinMap[cn]);
      });
      
      // 如果还是中文，就用时间戳
      if (/[\u4e00-\u9fa5]/.test(result)) {
        result = `field_${Date.now()}`;
      }
      
      // 清理和格式化
      result = result.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      return result;
    };

    const handleAddField = async () => {
      if (!newFieldLabel) {
        alert('请输入字段名称');
        return;
      }
      
      const newFieldKey = generateFieldKey(newFieldLabel);
      
      if (currentFields[newFieldKey]) {
        alert('该字段已存在！');
        return;
      }

      try {
        await handleAddFieldToAllPlatforms(sectionKey, newFieldKey, newFieldLabel, newFieldType);
        setNewFieldLabel('');
        setNewFieldType('text');
        showToast('字段添加成功！已同步到所有平台');
        
        // 手动更新当前编辑表单的字段配置，避免页面刷新
        window.location.reload(); // 临时刷新以显示新字段，后续可以优化为局部更新
      } catch (error) {
        console.error('添加字段失败:', error);
        showToast('添加字段失败');
      }
    };

    const handleDeleteField = async (fieldKey) => {
      await handleDeleteFieldFromAllPlatforms(sectionKey, fieldKey);
    };

    const handleSave = async () => {
      const cleanedData = {};
      Object.keys(currentFields).forEach(fieldKey => {
        cleanedData[fieldKey] = formData[fieldKey] || '';
      });
      console.log('Saving data:', cleanedData);
      await onSave(cleanedData);
    };

    return (
      <div className="space-y-4">
        {sortedFields.map(([fieldKey, fieldConfig]) => (
          <div key={fieldKey} className="flex flex-col">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">{fieldConfig.label}：</label>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteField(fieldKey)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="从所有平台删除此字段"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>
            {fieldConfig.type === 'image' ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpload(e, sectionKey, platformId, fieldKey)}
                  className="mt-1"
                />
                {formData[fieldKey] && (
                  <div className="relative">
                    <img
                      src={formData[fieldKey]}
                      alt="Preview"
                      className="h-40 w-40 object-contain rounded-lg border border-gray-200 shadow-md"
                    />
                    <button
                      onClick={() => handleDeleteImage(sectionKey, platformId, fieldKey)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="删除图片"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : fieldKey === 'creditCard' || fieldKey === 'eWallet' || fieldKey === 'regional' || fieldKey === 'other' || fieldKey === 'platforms' || fieldKey === 'systems' ? (
              <textarea
                value={Array.isArray(formData[fieldKey]) ? formData[fieldKey].join('、') : formData[fieldKey] || ''}
                onChange={e => handleChange(fieldKey, e.target.value.split('、').filter(item => item.trim()))}
                placeholder="多个项目用 、 分隔"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="2"
              />
            ) : (
              <textarea
                value={formData[fieldKey] || ''}
                onChange={e => handleChange(fieldKey, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
              />
            )}
          </div>
        ))}
        
        {isAdmin && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">添加新字段（同步到所有平台）</h4>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={newFieldLabel}
                onChange={e => setNewFieldLabel(e.target.value)}
                placeholder="字段名称（如：新字段）"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                value={newFieldType}
                onChange={e => setNewFieldType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="text">文本</option>
                <option value="image">图片</option>
              </select>
              <button
                onClick={handleAddField}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4 inline mr-1" /> 添加字段到所有平台
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Save className="w-4 h-4 inline mr-1" /> 保存
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <X className="w-4 h-4 inline mr-1" /> 取消
          </button>
        </div>
      </div>
    );
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  const isAdvantage = (sectionKey, platformId) => {
    return advantagePlatforms[sectionKey]?.includes(platformId) || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            代购平台详细对比系统
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            专业的代购平台对比分析工具
          </p>
          <div className="mt-2 text-sm text-green-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            已连接到 Supabase 云数据库
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => (isAdmin ? handleAdminLogout() : setShowAdminModal(true))}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" /> {isAdmin ? '退出管理员模式' : '进入管理员模式'}
          </button>
        </div>

        {showAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">管理员登录</h3>
              <input
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full p-2 border rounded-md mb-4"
                onKeyPress={e => e.key === 'Enter' && handleAdminLogin()}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAdminLogin}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  登录
                </button>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {showNewSectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">添加新板块</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newSection.label}
                  onChange={e => setNewSection({ ...newSection, label: e.target.value })}
                  placeholder="板块名称（如：新板块）"
                  className="w-full p-2 border rounded-md"
                />
                <select
                  value={newSection.icon}
                  onChange={e => setNewSection({ ...newSection, icon: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  添加
                </button>
                <button
                  onClick={() => setShowNewSectionModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-4">
          <TabButton id="comparison" label="平台对比" icon={ArrowUpDown} />
          <TabButton id="quick-view" label="快速查看" icon={Eye} />
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-500" />
              选择对比平台
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedPlatforms(platforms.map(p => p.id))}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                全选
              </button>
              <button
                onClick={() => setSelectedPlatforms([])}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                清空
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowNewSectionModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> 新增板块
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.id]);
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(id => id !== platform.id));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`flex items-center px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <img
                      src={getFaviconUrl(platform.url)}
                      alt={`${platform.name} favicon`}
                      className="w-6 h-6 mr-2 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                </label>
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePlatform(platform.id)}
                    className="ml-2 p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
            <div className="mt-4">
              <h4 className="text-md font-bold mb-2">新增平台</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newPlatform.name}
                  onChange={e => setNewPlatform({ ...newPlatform, name: e.target.value })}
                  placeholder="平台名称"
                  className="p-2 border rounded-md"
                />
                <input
                  type="text"
                  value={newPlatform.url}
                  onChange={e => setNewPlatform({ ...newPlatform, url: e.target.value })}
                  placeholder="平台URL (https://...)"
                  className="p-2 border rounded-md"
                />
                <button
                  onClick={handleAddPlatform}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  添加
                </button>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {Object.entries(sectionConfigs)
              .sort((a, b) => (a[1].displayOrder || 0) - (b[1].displayOrder || 0))
              .map(([key, section]) => {
              const Icon = section.icon;
              const isExpanded = expandedSections[key] !== false;
              const sectionData = platformData[key];

              if (!sectionData) return null;

              return (
                <div key={key} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-between hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon className="w-6 h-6 text-white mr-3" />
                      <h2 className="text-xl font-bold text-white">{section.label}</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(key);
                          }}
                          className="p-1 text-white hover:text-red-300"
                          title="删除板块"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-6">
                      {selectedPlatforms.length === 0 ? (
                        <p className="text-center text-gray-500">请至少选择一个平台进行对比</p>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {platforms
                            .filter(p => selectedPlatforms.includes(p.id))
                            .map(platform => {
                              const data = { ...sectionData.data[platform.id], platformId: platform.id };
                              const hasAdvantage = isAdvantage(key, platform.id);

                              return (
                                <div key={platform.id} className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 ${
                                  hasAdvantage 
                                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg transform scale-105' 
                                    : 'border-gray-100'
                                }`}>
                                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                    <div className="flex items-center">
                                      {hasAdvantage && (
                                        <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                                      )}
                                      <img
                                        src={getFaviconUrl(platform.url)}
                                        alt={`${platform.name} favicon`}
                                        className="w-6 h-6 mr-2 object-contain"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                      />
                                      <a href={platform.url} target="_blank" rel="noopener noreferrer" className={`font-bold text-lg hover:underline ${
                                        hasAdvantage ? 'text-yellow-700' : 'text-gray-900'
                                      }`}>
                                        {platform.name}
                                      </a>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {isAdmin && (
                                        <>
                                          <button
                                            onClick={() => handleToggleAdvantage(key, platform.id)}
                                            className={`p-1 rounded transition-colors ${
                                              hasAdvantage 
                                                ? 'text-yellow-600 hover:text-yellow-800' 
                                                : 'text-gray-400 hover:text-yellow-500'
                                            }`}
                                            title={hasAdvantage ? '取消优势标记' : '标记为优势'}
                                          >
                                            <Crown className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleEditPlatform(platform.id, key)}
                                            className="p-1 text-blue-500 hover:text-blue-700"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {editMode === key && editPlatformId === platform.id ? (
                                    <EditForm
                                      sectionKey={key}
                                      platformId={platform.id}
                                      onClose={() => setEditMode(null)}
                                      onSave={formData => handleSaveEdit(key, platform.id, formData)}
                                    />
                                  ) : (
                                    renderSectionData(key, data)
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'quick-view' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {selectedPlatforms.length === 0 ? (
              <p className="p-6 text-center text-gray-500">请至少选择一个平台进行对比</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold sticky left-0 z-10 bg-gradient-to-r from-blue-500 to-purple-600">
                        平台信息
                      </th>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <th key={platform.id} className="px-6 py-4 text-center font-semibold min-w-[150px]">
                            <div className="flex items-center justify-center">
                              <img
                                src={getFaviconUrl(platform.url)}
                                alt={`${platform.name} favicon`}
                                className="w-6 h-6 mr-2 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <a href={platform.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {platform.name}
                              </a>
                            </div>
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sectionConfigs)
                      .sort((a, b) => (a[1].displayOrder || 0) - (b[1].displayOrder || 0))
                      .map(([sectionKey, section], sectionIndex) => {
                        const fields = fieldConfigs[sectionKey] || {};
                        const sortedFields = Object.entries(fields)
                          .filter(([fieldKey, fieldConfig]) => fieldConfig.type !== 'image')
                          .sort((a, b) => (a[1].displayOrder || 0) - (b[1].displayOrder || 0));

                        return sortedFields.map(([fieldKey, fieldConfig], fieldIndex) => (
                          <tr key={`${sectionKey}-${fieldKey}`} className={`border-b border-gray-200 ${(sectionIndex * sortedFields.length + fieldIndex) % 2 === 0 ? 'bg-gray-50' : ''}`}>
                            <td className={`px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 ${(sectionIndex * sortedFields.length + fieldIndex) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                              {fieldConfig.label}
                            </td>
                            {platforms
                              .filter(p => selectedPlatforms.includes(p.id))
                              .map(platform => (
                                <td key={platform.id} className="px-6 py-3 text-center text-sm">
                                  {platformData[sectionKey]?.data[platform.id]?.[fieldKey] || '-'}
                                </td>
                              ))}
                          </tr>
                        ));
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="关闭"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 添加 CSS 动画样式 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
