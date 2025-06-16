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

  const defaultSections = {
    accountVerification: { label: '账户验证方式', icon: Users, defaultData: { method: '', issues: '', verificationInterface: '', image: '' } },
    payment: { label: '支付方式', icon: CreditCard, defaultData: { creditCard: [], eWallet: [], regional: [], other: [], image: '' } },
    storage: { label: '保管期', icon: Package, defaultData: { free: '', extended: '', image: '' } },
    qc: { label: 'QC质检', icon: Star, defaultData: { free: '', extra: '', quality: '', image: '' } },
    shipping: { label: '运费与保险', icon: Truck, defaultData: { rehearsal: '', seizure: '', loss: '', delay: '', image: '' } },
    customerService: { label: '客服支持', icon: MessageCircle, defaultData: { hours: '', days: '', response: '', image: '' } },
    discord: { label: 'Discord社区', icon: Users, defaultData: { members: '', activities: '', rewards: '', referral: '', dcLink: '', image: '' } },
    timing: { label: '时效', icon: Clock, defaultData: { accept: '', purchase: '', shipping: '', arrival: '', qc: '', image: '' } },
    coupon: { label: '优惠券', icon: Gift, defaultData: { amount: '', type: '', threshold: '', maxDiscount: '', stackable: '', image: '' } },
    language: { label: '语言与货币', icon: Globe, defaultData: { languages: '', currencies: '', image: '' } },
    commission: { label: '联盟佣金', icon: Percent, defaultData: { base: '', max: '', mechanism: '', image: '' } },
    membership: { label: '会员体系', icon: Award, defaultData: { points: '', usage: '', special: '', image: '' } },
    transshipment: { label: '转运服务', icon: Globe, defaultData: { address: '', requirements: '', image: '' } },
    supportedPlatforms: { label: '支持链接平台', icon: Link, defaultData: { platforms: [], image: '' } },
    app: { label: 'APP体验', icon: Smartphone, defaultData: { systems: [], size: '', languages: '', features: '', image: '' } },
    valueAddedService: { label: '增值服务', icon: Plus, defaultData: { free: '', paid: '', shipping: '', image: '' } },
    customLogistics: { label: '定制物流', icon: Settings, defaultData: { hasService: '', needInfo: '', tips: '', feeDescription: '', displayInterface: '', image: '' } },
    afterSales: { label: '售后', icon: MessageCircle, defaultData: { returnFee: '', returnTime: '', processingTime: '', image: '' } }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const platformsData = await supabase.getPlatforms();
      setPlatforms(platformsData || []);
      setSelectedPlatforms((platformsData || []).map(p => p.id));

      const platformDataRows = await supabase.getPlatformData();
      const formattedData = {};
      
      Object.keys(defaultSections).forEach(sectionKey => {
        formattedData[sectionKey] = {
          label: defaultSections[sectionKey].label,
          icon: defaultSections[sectionKey].icon,
          data: {}
        };
        (platformsData || []).forEach(platform => {
          formattedData[sectionKey].data[platform.id] = { ...defaultSections[sectionKey].defaultData };
        });
      });

      if (platformDataRows) {
        platformDataRows.forEach(row => {
          if (formattedData[row.section_key]) {
            formattedData[row.section_key].data[row.platform_id] = { ...row.data };
          }
        });
      }

      setPlatformData(formattedData);

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
      alert('请输入平台名称和URL');
      return;
    }

    try {
      const newPlatformData = await supabase.createPlatform(newPlatform);
      if (newPlatformData && newPlatformData.length > 0) {
        const created = newPlatformData[0];
        setPlatforms(prev => [...prev, created]);
        setSelectedPlatforms(prev => [...prev, created.id]);
        
        setPlatformData(prev => {
          const updated = { ...prev };
          Object.keys(defaultSections).forEach(sectionKey => {
            updated[sectionKey].data[created.id] = { ...defaultSections[sectionKey].defaultData };
          });
          return updated;
        });
        
        setNewPlatform({ name: '', url: '' });
        alert('平台添加成功！');
        await loadData(); // 重新加载数据
      }
    } catch (error) {
      console.error('添加平台失败:', error);
      alert('添加平台失败');
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
        await loadData(); // 重新加载数据
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
    try {
      const currentData = platformData[sectionKey].data[id] || {};
      const mergedData = { ...currentData, ...updatedData };
      Object.keys(mergedData).forEach(key => {
        if (!customFields.some(field => field.key === key)) {
          delete mergedData[key]; // 移除不在 customFields 中的字段
        }
      });

      await supabase.upsertPlatformData(sectionKey, id, mergedData);
      
      setPlatformData(prev => {
        const newData = { ...prev };
        newData[sectionKey].data[id] = mergedData;
        return newData;
      });
      
      setEditMode(null);
      setEditPlatformId(null);
      alert('数据保存成功！');
      await loadData(); // 重新加载数据
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
      await loadData(); // 重新加载数据
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
        await loadData(); // 重新加载数据
      } catch (error) {
        console.error('删除图片失败:', error);
        alert('删除图片失败');
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

  const renderSimpleData = (data, fields) => {
    if (!data) return <span className="text-gray-400">数据缺失</span>;
    return (
      <div className="space-y-2 text-sm">
        {fields.map(field => (
          <div key={field.key}>
            <span className="font-medium text-gray-700">{field.label}：</span>
            <span className="text-gray-600">{data[field.key] || '数据缺失'}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderPaymentMethods = (paymentData) => {
    if (!paymentData) return <span className="text-gray-400">数据缺失</span>;
    return (
      <div className="space-y-2 text-sm">
        {paymentData.creditCard?.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">信用卡/借记卡：</span>
            <span className="text-gray-600">{paymentData.creditCard.join('、')}</span>
          </div>
        )}
        {paymentData.eWallet?.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">电子钱包：</span>
            <span className="text-gray-600">{paymentData.eWallet.join('、')}</span>
          </div>
        )}
        {paymentData.regional?.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">地区特色：</span>
            <span className="text-gray-600">{paymentData.regional.join('、')}</span>
          </div>
        )}
        {paymentData.other?.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">其他：</span>
            <span className="text-gray-600">{paymentData.other.join('、')}</span>
          </div>
        )}
      </div>
    );
  };

  const renderSectionData = (key, data) => {
    if (!data) return <span className="text-gray-400">数据缺失</span>;

    const fields = {
      accountVerification: [
        { key: 'method', label: '验证方式' },
        { key: 'issues', label: '体验问题' },
        { key: 'verificationInterface', label: '验证界面' },
      ],
      storage: [
        { key: 'free', label: '免费保管期' },
        { key: 'extended', label: '延长存储' },
      ],
      qc: [
        { key: 'free', label: '免费QC' },
        { key: 'extra', label: '额外QC价格' },
        { key: 'quality', label: '照片质量' },
      ],
      shipping: [
        { key: 'rehearsal', label: '预演包裹费' },
        { key: 'seizure', label: '海关扣押险' },
        { key: 'loss', label: '丢失/损坏险' },
        { key: 'delay', label: '延迟险' },
      ],
      customerService: [
        { key: 'hours', label: '工作时间' },
        { key: 'days', label: '工作日' },
        { key: 'response', label: '响应时间' },
      ],
      discord: [
        { key: 'members', label: '社区人数' },
        { key: 'activities', label: '活动频率' },
        { key: 'rewards', label: '奖励形式' },
        { key: 'referral', label: '拉新奖励' },
        { key: 'dcLink', label: 'DC链接' },
      ],
      timing: [
        { key: 'accept', label: '接单时间' },
        { key: 'purchase', label: '采购时间' },
        { key: 'shipping', label: '卖家发货' },
        { key: 'arrival', label: '到仓时间' },
        { key: 'qc', label: '质检上架' },
      ],
      coupon: [
        { key: 'amount', label: '优惠金额' },
        { key: 'type', label: '券码类型' },
        { key: 'threshold', label: '使用门槛' },
        { key: 'maxDiscount', label: '最高折扣' },
        { key: 'stackable', label: '叠加使用' },
      ],
      commission: [
        { key: 'base', label: '基础佣金' },
        { key: 'max', label: '最高佣金' },
        { key: 'mechanism', label: '计算机制' },
      ],
      membership: [
        { key: 'points', label: '积分获取' },
        { key: 'usage', label: '积分使用' },
        { key: 'special', label: '特色功能' },
      ],
      transshipment: [
        { key: 'address', label: '转运地址' },
        { key: 'requirements', label: '信息要求' },
      ],
      app: [
        { key: 'systems', label: '支持系统' },
        { key: 'size', label: '安装包大小' },
        { key: 'languages', label: '语言货币' },
        { key: 'features', label: '特色功能' },
      ],
      customLogistics: [
        { key: 'hasService', label: '是否有定制物流' },
        { key: 'needInfo', label: '需要填写的信息' },
        { key: 'tips', label: '提示信息' },
        { key: 'feeDescription', label: '费用说明' },
        { key: 'displayInterface', label: '展示界面' },
      ],
      afterSales: [
        { key: 'returnFee', label: '商品退换货费用' },
        { key: 'returnTime', label: '商品退换货官方时效' },
        { key: 'processingTime', label: '包裹售后处理时间' },
      ],
    };

    return (
      <div className="space-y-3 text-sm">
        {key === 'payment' ? (
          renderPaymentMethods(data)
        ) : key === 'language' ? (
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block mb-1">支持语言：</span>
              <span className="text-gray-600 text-xs">{data.languages}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block mb-1">支持货币：</span>
              <span className="text-gray-600 text-xs">{data.currencies}</span>
            </div>
          </div>
        ) : key === 'supportedPlatforms' ? (
          <div className="text-sm">
            <span className="font-medium text-gray-700">支持平台：</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {(data.platforms || []).map(p => (
                <span key={p} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {p}
                </span>
              ))}
            </div>
          </div>
        ) : key === 'valueAddedService' ? (
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block mb-1">免费服务：</span>
              <span className="text-gray-600 text-xs">{data.free || '无'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block mb-1">收费服务：</span>
              <span className="text-gray-600 text-xs">{data.paid}</span>
            </div>
            {data.shipping && data.shipping !== '无' && (
              <div>
                <span className="font-medium text-gray-700 block mb-1">运单增值：</span>
                <span className="text-gray-600 text-xs">{data.shipping}</span>
              </div>
            )}
          </div>
        ) : (
          renderSimpleData(data, fields[key] || [])
        )}
        {data.image && (
          <div className="mt-3 relative">
            <img
              src={data.image}
              alt={`${key} Image`}
              className="h-40 w-40 object-contain rounded-lg border border-gray-200 shadow-md hover:scale-105 transition-transform cursor-pointer"
              loading="lazy"
              onClick={() => setPreviewImage(data.image)}
            />
            {isAdmin && (
              <button
                onClick={() => handleDeleteImage(key, data.platformId, 'image')}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="删除图片"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const EditForm = ({ sectionKey, platformId, onClose, onSave }) => {
    const [formData, setFormData] = useState(() => ({ ...platformData[sectionKey].data[platformId] }));
    const [customFields, setCustomFields] = useState(Object.keys(formData).map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1), type: key === 'image' ? 'image' : 'text' })));

    const handleChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleAddField = () => {
      const newFieldName = prompt('请输入新类目名称：');
      if (newFieldName) {
        const fieldType = prompt('请选择类目类型（text/image）：', 'text');
        if (fieldType === 'text' || fieldType === 'image') {
          setCustomFields(prev => [...prev, { key: newFieldName.toLowerCase(), label: newFieldName, type: fieldType }]);
          handleChange(newFieldName.toLowerCase(), fieldType === 'image' ? '' : '');
        } else {
          alert('无效类型！请选择 "text" 或 "image"。');
        }
      }
    };

    const handleDeleteField = (keyToDelete) => {
      if (window.confirm(`确认删除类目 "${keyToDelete}" 吗？`)) {
        setCustomFields(prev => prev.filter(field => field.key !== keyToDelete));
        setFormData(prev => {
          const newData = { ...prev };
          delete newData[keyToDelete];
          return newData;
        });
        onSave({ ...formData, [keyToDelete]: undefined }); // 立即保存更改
      }
    };

    return (
      <div className="space-y-4">
        {customFields.map(field => (
          <div key={field.key} className="flex flex-col">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">{field.label}：</label>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteField(field.key)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>
            {field.type === 'image' ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpload(e, sectionKey, platformId, field.key)}
                  className="mt-1"
                />
                {formData[field.key] && (
                  <div className="relative">
                    <img
                      src={formData[field.key]}
                      alt="Preview"
                      className="h-40 w-40 object-contain rounded-lg border border-gray-200 shadow-md"
                    />
                    <button
                      onClick={() => handleDeleteImage(sectionKey, platformId, field.key)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="删除图片"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : field.key === 'creditCard' || field.key === 'eWallet' || field.key === 'regional' || field.key === 'other' || field.key === 'platforms' || field.key === 'systems' ? (
              <textarea
                value={Array.isArray(formData[field.key]) ? formData[field.key].join('、') : formData[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value.split('、').filter(item => item.trim()))}
                placeholder="多个项目用 、 分隔"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="2"
              />
            ) : (
              <textarea
                value={formData[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
              />
            )}
          </div>
        ))}
        {isAdmin && (
          <button
            onClick={handleAddField}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-4 h-4 inline mr-1" /> 添加类目
          </button>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => onSave(formData)}
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
            云端同步 · 实时更新 · 多人协作
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
            {Object.entries(platformData).map(([key, section]) => {
              const Icon = section.icon;
              const isExpanded = expandedSections[key] !== false;

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
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
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
                              const data = { ...section.data[platform.id], platformId: platform.id };
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
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                        验证方式
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.accountVerification?.data[platform.id]?.method || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-white">
                        免费保管期
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.storage?.data[platform.id]?.free || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                        免费QC张数
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.qc?.data[platform.id]?.free || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-white">
                        额外QC价格
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.qc?.data[platform.id]?.extra || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                        预演包裹费
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.shipping?.data[platform.id]?.rehearsal || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-white">
                        客服时间
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.customerService?.data[platform.id]?.hours || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                        Discord人数
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.discord?.data[platform.id]?.members || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-white">
                        优惠金额
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.coupon?.data[platform.id]?.amount || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                        支持语言数
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.language?.data[platform.id]?.languages?.split('：')[0] || '-'}
                          </td>
                        ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3 font-semibold text-gray-900 sticky left-0 z-10 bg-white">
                        支持货币数
                      </td>
                      {platforms
                        .filter(p => selectedPlatforms.includes(p.id))
                        .map(platform => (
                          <td key={platform.id} className="px-6 py-3 text-center text-sm">
                            {platformData.language?.data[platform.id]?.currencies?.split('：')[0] || '-'}
                          </td>
                        ))}
                    </tr>
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
    </div>
  );
}

export default App;
