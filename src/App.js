import React, { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, Package, Star, Truck, MessageCircle, Users, Clock, Gift, Globe, Percent, Award, ArrowUpDown, Link, Smartphone, Plus, Filter, Eye, ChevronDown, ChevronUp, Edit, Trash, Save, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editPlatformId, setEditPlatformId] = useState<number | null>(null);
  const [newPlatform, setNewPlatform] = useState({ name: '', url: '' });

  const [platforms, setPlatforms] = useState(() => {
    const saved = localStorage.getItem('platforms');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'cnfans', url: 'https://cnfans.com' },
      { id: 2, name: 'mulebuy', url: 'https://mulebuy.com' },
      { id: 3, name: 'Lovegobuy', url: 'https://lovegobuy.com' },
      { id: 4, name: 'Allchinabuy', url: 'https://allchinabuy.com' },
      { id: 5, name: 'hoobuy', url: 'https://hoobuy.com' },
      { id: 6, name: 'kakobuy', url: 'https://kakobuy.com' },
      { id: 7, name: 'oopbuy', url: 'https://oopbuy.com' },
      { id: 8, name: 'Acbuy', url: 'https://acbuy.com' },
      { id: 9, name: 'itaobuy', url: 'https://itaobuy.com' }
    ];
  });

  const [platformData, setPlatformData] = useState(() => {
    const saved = localStorage.getItem('platformData');
    return saved ? JSON.parse(saved) : {
      accountVerification: {
        label: '账户验证方式',
        icon: Users,
        data: {
          1: { method: '邮箱点击验证', issues: '有风险提示' },
          2: { method: '邮箱点击验证', issues: '链接警告' },
          3: { method: '邮箱点击验证', issues: '体验较好' },
          4: { method: '邮箱点击验证', issues: '链接过长' },
          5: { method: '验证码验证', issues: '短信验证' },
          6: { method: '邮箱点击验证', issues: '验证麻烦' },
          7: { method: '验证码验证', issues: '内容不突出' },
          8: { method: '邮箱点击验证', issues: '排版混乱' },
          9: { method: '邮箱点击验证', issues: '风险提示' }
        }
      },
      payment: {
        label: '支付方式',
        icon: CreditCard,
        data: {
          1: { creditCard: ['Visa', 'Amex', 'JCB', 'Mastercard'], eWallet: ['Google Pay', 'Alipay', 'Skrill'], regional: ['MyBank', 'Mbway', 'Multibanco', 'Neosurf'], other: ['PIX', 'PayU'] },
          2: { creditCard: ['Visa', 'Discover', 'Mastercard', 'Maestro'], eWallet: ['Skrill'], regional: [], other: [] },
          3: { creditCard: ['Visa', 'Mastercard', 'Apple Pay'], eWallet: ['Alipay', 'Binance'], regional: ['PIX'], other: [] },
          4: { creditCard: ['Visa', 'Mastercard', 'Google Pay'], eWallet: [], regional: ['PIX'], other: [] },
          5: { creditCard: ['Visa', 'UnionPay', 'JCB'], eWallet: ['Alipay'], regional: ['Sofort'], other: ['PIX'] },
          6: { creditCard: ['Visa', 'Mastercard', 'Diners Club'], eWallet: ['Google Pay', 'Skrill'], regional: ['Trustly'], other: [] },
          7: { creditCard: ['Visa', 'Master'], eWallet: [], regional: [], other: [] },
          8: { creditCard: ['Visa', 'Master'], eWallet: ['Google Pay'], regional: ['PayU'], other: [] },
          9: { creditCard: ['Visa', 'Master'], eWallet: ['Google Pay'], regional: [], other: [] }
        }
      },
      storage: {
        label: '保管期',
        icon: Package,
        data: {
          1: { free: '60天', extended: '6个月' },
          2: { free: '90天', extended: '6个月' },
          3: { free: '60天', extended: '6个月' },
          4: { free: '90天', extended: '6个月' },
          5: { free: '90天', extended: '6个月' },
          6: { free: '180天', extended: '100天' },
          7: { free: '90天', extended: '6个月' },
          8: { free: '90天', extended: '6个月' },
          9: { free: '90天', extended: '6个月' }
        }
      },
      qc: {
        label: 'QC质检',
        icon: Star,
        data: {
          1: { free: '3-7张', extra: '1元/张', quality: '高', image: '' },
          2: { free: '3-7张', extra: '1.5元/张', quality: '未知', image: '' },
          3: { free: '3张', extra: '1元/张', quality: '中', image: '' },
          4: { free: '3-5张', extra: '2元/张', quality: '中', image: '' },
          5: { free: '3-4张', extra: '1元/张', quality: '中', image: '' },
          6: { free: '3张', extra: '1元/张', quality: '高', image: '' },
          7: { free: '6张', extra: '1元/张', quality: '中', image: '' },
          8: { free: '3张', extra: '2元/张', quality: '高', image: '' },
          9: { free: '3-6张', extra: '1元/张', quality: '高', image: '' }
        }
      },
      shipping: {
        label: '运费与保险',
        icon: Truck,
        data: {
          1: { rehearsal: '20元', seizure: '免费', loss: '60天', delay: '无' },
          2: { rehearsal: '20元', seizure: '3%', loss: '无', delay: '无' },
          3: { rehearsal: '15元', seizure: '无', loss: '无', delay: '无' },
          4: { rehearsal: '20元', seizure: '7000元', loss: '7000元', delay: '20%' },
          5: { rehearsal: '20元', seizure: '3%', loss: '30天', delay: '20%' },
          6: { rehearsal: '20元', seizure: '3%', loss: '45天', delay: '20%' },
          7: { rehearsal: '20元', seizure: '15%', loss: '全额', delay: '100%' },
          8: { rehearsal: '20元', seizure: '7000元', loss: '7000元', delay: '无' },
          9: { rehearsal: '无', seizure: '无', loss: '无', delay: '无' }
        }
      },
      customerService: {
        label: '客服支持',
        icon: MessageCircle,
        data: {
          1: { hours: '9:30-18:00', days: '周一至周五', response: '无承诺' },
          2: { hours: '9:00-18:00', days: '周一至周日', response: '24小时' },
          3: { hours: '8:30-19:00', days: '周一至周六', response: '24小时' },
          4: { hours: '9:00-18:00', days: '周一至周日', response: '24-48小时' },
          5: { hours: '9:00-19:00', days: '周一至周日', response: '24小时' },
          6: { hours: '8:00-17:00', days: '周一至周日', response: '无承诺' },
          7: { hours: '9:30-19:00', days: '无时间', response: '24小时' },
          8: { hours: '9:00-18:00', days: '无时间', response: '24-48小时' },
          9: { hours: '9:00-18:00', days: '无时间', response: '12小时' }
        }
      },
      discord: {
        label: 'Discord社区',
        icon: Users,
        data: {
          1: { members: '337,269', activities: '1-2次/月', rewards: '积分', referral: '1000CNY' },
          2: { members: '75,449', activities: '1-3次/月', rewards: '优惠券', referral: '100运费' },
          3: { members: '7,585', activities: '1次/月', rewards: 'balance', referral: '20%折扣' },
          4: { members: '103,085', activities: '1次/月', rewards: '免运费', referral: '现金' },
          5: { members: '52,014', activities: '封禁', rewards: '封禁', referral: '封禁' },
          6: { members: '43,550', activities: '1次/月', rewards: '充值', referral: '免运费' },
          7: { members: '54,249', activities: '1-2次/月', rewards: '硬币', referral: '30%折扣' },
          8: { members: '47,743', activities: '1-2次/月', rewards: '礼赠', referral: '现金' },
          9: { members: '396', activities: '1次', rewards: '优惠券', referral: '无' }
        }
      },
      timing: {
        label: '时效',
        icon: Clock,
        data: {
          1: { accept: '2小时', purchase: '6小时', shipping: '27小时', arrival: '3-4天', qc: '24小时' },
          2: { accept: '未知', purchase: '未知', shipping: '未知', arrival: '未知', qc: '未知' },
          3: { accept: '0.5小时', purchase: '6小时', shipping: '24小时', arrival: '1-3天', qc: '24小时' },
          4: { accept: '0.5小时', purchase: '未知', shipping: '48小时', arrival: '2天', qc: '48小时' },
          5: { accept: '0.5小时', purchase: '6小时', shipping: '3-7天', arrival: '1-7天', qc: '24小时' },
          6: { accept: '12小时', purchase: '6小时', shipping: '2-7天', arrival: '2天', qc: '24小时' },
          7: { accept: '6小时', purchase: '6小时', shipping: '3-7天', arrival: '1-7天', qc: '24小时' },
          8: { accept: '0.5小时', purchase: '未知', shipping: '24小时', arrival: '1-3天', qc: '24小时' },
          9: { accept: '4.5小时', purchase: '6小时', shipping: '24小时', arrival: '3-5天', qc: '48小时' }
        }
      },
      coupon: {
        label: '优惠券',
        icon: Gift,
        data: {
          1: { amount: '$150', type: '运费折扣', threshold: '无', maxDiscount: '10.74%', stackable: '否' },
          2: { amount: '$210', type: '未知', threshold: '未知', maxDiscount: '未知', stackable: '未知' },
          3: { amount: '$210+30%', type: '运费折扣', threshold: '有', maxDiscount: '15%', stackable: '否' },
          4: { amount: '$150', type: '运费折扣', threshold: '有', maxDiscount: '12%', stackable: '否' },
          5: { amount: '$200', type: '综合折扣', threshold: '无', maxDiscount: '10%', stackable: '否' },
          6: { amount: '$410', type: '运费折扣', threshold: '无', maxDiscount: '12%', stackable: '否' },
          7: { amount: '$210+30%', type: '运费折扣', threshold: '无', maxDiscount: '10%', stackable: '否' },
          8: { amount: '$150', type: '运费折扣', threshold: '无', maxDiscount: '12%', stackable: '否' },
          9: { amount: '$277', type: '运费折扣', threshold: '50CNY', maxDiscount: '40%', stackable: '否' }
        }
      },
      language: {
        label: '语言与货币',
        icon: Globe,
        data: {
          1: { languages: '10种', currencies: '9种' },
          2: { languages: '10种', currencies: '9种' },
          3: { languages: '8种', currencies: '5种' },
          4: { languages: '2种', currencies: '2种' },
          5: { languages: '7种', currencies: '11种' },
          6: { languages: '16种', currencies: '11种' },
          7: { languages: '9种', currencies: '16种' },
          8: { languages: '4种', currencies: '4种' },
          9: { languages: '2种', currencies: '15种' }
        }
      },
      commission: {
        label: '联盟佣金',
        icon: Percent,
        data: {
          1: { base: '3%', max: '7%', mechanism: '按物流量' },
          2: { base: '未知', max: '未知', mechanism: '未知' },
          3: { base: '灵活', max: '按数量', mechanism: '按消费' },
          4: { base: '3.5%', max: '7.5%', mechanism: '按包裹' },
          5: { base: '综合', max: '折扣', mechanism: '按消费' },
          6: { base: '3.5%', max: '7.5%', mechanism: '按运费' },
          7: { base: '2%', max: '6%', mechanism: '首单+运费' },
          8: { base: '3.5%', max: '7.5%', mechanism: '同Allchinabuy' },
          9: { base: '4%', max: '9%', mechanism: '按累计' }
        }
      },
      membership: {
        label: '会员体系',
        icon: Award,
        data: {
          1: { points: '1:1', usage: '多用途', special: '可购买' },
          2: { points: '无', usage: '无', special: '无' },
          3: { points: '无', usage: '无', special: '无' },
          4: { points: '1:1', usage: '抵扣', special: '1年' },
          5: { points: '无', usage: '无', special: '无' },
          6: { points: '无', usage: '无', special: '无' },
          7: { points: '按运费', usage: '运费', special: '未完善' },
          8: { points: '无', usage: '无', special: '无' },
          9: { points: '按消费', usage: '佣金', special: '折扣' }
        }
      },
      transshipment: {
        label: '转运服务',
        icon: Globe,
        data: {
          1: { address: '无', requirements: '无' },
          2: { address: '惠州', requirements: '国家+单号' },
          3: { address: '无', requirements: '无' },
          4: { address: '惠州', requirements: '详情' },
          5: { address: '厦门', requirements: '单号' },
          6: { address: '厦门', requirements: '单号' },
          7: { address: '厦门', requirements: '单号' },
          8: { address: '惠州', requirements: '详情' },
          9: { address: '河源', requirements: '单号' }
        }
      },
      supportedPlatforms: {
        label: '支持链接平台',
        icon: Link,
        data: {
          1: { platforms: ['淘宝', '1688', '微店'] },
          2: { platforms: ['淘宝', '1688', '微店', '天猫国际'] },
          3: { platforms: ['淘宝', '1688', '微店', '天猫国际'] },
          4: { platforms: ['淘宝', '1688', '微店', '天猫国际', '京东', '闲鱼'] },
          5: { platforms: ['淘宝', '1688', '微店', '天猫国际', '京东'] },
          6: { platforms: ['淘宝', '1688', '微店', '天猫国际'] },
          7: { platforms: ['淘宝', '1688', '微店', '天猫国际'] },
          8: { platforms: ['淘宝', '1688', '微店', '天猫国际', '京东', '闲鱼'] },
          9: { platforms: ['淘宝', '1688', '微店', '天猫国际'] }
        }
      },
      app: {
        label: 'APP体验',
        icon: Smartphone,
        data: {
          1: { systems: ['iOS', 'Android'], size: '88MB', languages: '10种', features: '多功能' },
          2: { systems: ['iOS', 'Android'], size: '73MB', languages: '10种', features: '基础' },
          3: { systems: ['iOS'], size: '11.4MB', languages: '8种', features: '不完善' },
          4: { systems: ['iOS', 'Android'], size: '未知', languages: '2种', features: '少种类' },
          5: { systems: ['iOS', 'Android'], size: '108MB', languages: '8种', features: '无二维码' },
          6: { systems: ['无'], size: '无', languages: '无', features: '无' },
          7: { systems: ['iOS', 'Android'], size: '未知', languages: '9种', features: '多货币' },
          8: { systems: ['iOS', 'Android'], size: '未知', languages: '1种', features: '少种类' },
          9: { systems: ['iOS'], size: '82.6MB', languages: '2种', features: '简单' }
        }
      },
      valueAddedService: {
        label: '增值服务',
        icon: Plus,
        data: {
          1: { free: '无', paid: '多种', shipping: '无' },
          2: { free: '无', paid: '多种', shipping: '无' },
          3: { free: '无', paid: '拆包装', shipping: '无' },
          4: { free: '简包装', paid: '多种', shipping: '多种' },
          5: { free: '简包装', paid: '多种', shipping: '无' },
          6: { free: '去包装', paid: '多种', shipping: '无' },
          7: { free: '简包装', paid: '多种', shipping: '无' },
          8: { free: '简包装', paid: '多种', shipping: '无' },
          9: { free: '简包装', paid: '多种', shipping: '无' }
        }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('platforms', JSON.stringify(platforms));
    localStorage.setItem('platformData', JSON.stringify(platformData));
  }, [platforms, platformData]);

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

  const handleAddPlatform = () => {
    if (!newPlatform.name || !newPlatform.url) {
      alert('请输入平台名称和URL');
      return;
    }
    const newId = Math.max(...platforms.map(p => p.id), 0) + 1;
    const updatedPlatforms = [...platforms, { id: newId, name: newPlatform.name, url: newPlatform.url }];
    setPlatforms(updatedPlatforms);
    setSelectedPlatforms([...selectedPlatforms, newId]);

    const updatedPlatformData = { ...platformData };
    Object.keys(updatedPlatformData).forEach(section => {
      const defaultData = {};
      Object.keys(updatedPlatformData[section].data[1] || {}).forEach(key => {
        defaultData[key] = Array.isArray(updatedPlatformData[section].data[1][key]) ? [] : '';
      });
      updatedPlatformData[section].data[newId] = defaultData;
    });
    setPlatformData(updatedPlatformData);
    setNewPlatform({ name: '', url: '' });
  };

  const handleDeletePlatform = (id) => {
    if (window.confirm(`确认删除平台 ${platforms.find(p => p.id === id).name} 吗？`)) {
      setPlatforms(platforms.filter(p => p.id !== id));
      setSelectedPlatforms(selectedPlatforms.filter(pId => pId !== id));
      const updatedPlatformData = { ...platformData };
      Object.keys(updatedPlatformData).forEach(section => {
        delete updatedPlatformData[section].data[id];
      });
      setPlatformData(updatedPlatformData);
    }
  };

  const handleEditPlatform = (id, sectionKey) => {
    setEditMode(sectionKey);
    setEditPlatformId(id);
  };

  const handleSaveEdit = (sectionKey, id, updatedData) => {
    setPlatformData(prev => {
      const newData = { ...prev };
      newData[sectionKey].data[id] = updatedData;
      return newData;
    });
    setEditMode(null);
    setEditPlatformId(null);
  };

  const handleImageUpload = (e, setState, key, sectionKey, platformId) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (sectionKey && platformId) {
          setPlatformData(prev => {
            const updated = { ...prev };
            updated[sectionKey].data[platformId] = { ...updated[sectionKey].data[platformId], [key]: reader.result };
            return updated;
          });
        } else {
          setState(prev => ({ ...prev, [key]: reader.result }));
        }
      };
      reader.onerror = () => console.error('图片读取失败');
      reader.readAsDataURL(file);
    } else {
      alert('请上传图片文件！');
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

  const EditForm = ({ sectionKey, platformId, onClose, onSave }) => {
    const [formData, setFormData] = useState(() => ({ ...platformData[sectionKey].data[platformId] }));

    const handleChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div className="space-y-4">
        {Object.keys(formData).map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            {Array.isArray(formData[key]) ? (
              <input
                type="text"
                value={formData[key].join(',')}
                onChange={e => handleChange(key, e.target.value.split(','))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : key === 'image' ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpload(e, setFormData, key, sectionKey, platformId)}
                  className="mt-1"
                />
                {formData[key] && <img src={formData[key]} alt="Preview" className="mt-2 h-20 w-20 object-contain" />}
              </div>
            ) : (
              <input
                type="text"
                value={formData[key]}
                onChange={e => handleChange(key, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
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

  // 获取 favicon 的 URL
  const getFaviconUrl = (url) => {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

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
            查看9个代购平台的详细信息对比
          </p>
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
                      onError={(e) => { e.target.src = '/default-favicon.png'; }}
                    />
                    {selectedPlatforms.includes(platform.id) ? (
                      <a href={platform.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                        {platform.name}
                      </a>
                    ) : (
                      <span className="font-medium">{platform.name}</span>
                    )}
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
                  placeholder="平台URL"
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
                              const data = section.data[platform.id];

                              return (
                                <div key={platform.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                    <div className="flex items-center">
                                      <img
                                        src={getFaviconUrl(platform.url)}
                                        alt={`${platform.name} favicon`}
                                        className="w-6 h-6 mr-2 object-contain"
                                        onError={(e) => { e.target.src = '/default-favicon.png'; }}
                                      />
                                      <a href={platform.url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 text-lg hover:underline">
                                        {platform.name}
                                      </a>
                                    </div>
                                    {isAdmin && (
                                      <button
                                        onClick={() => handleEditPlatform(platform.id, key)}
                                        className="p-1 text-blue-500 hover:text-blue-700"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>

                                  {editMode === key && editPlatformId === platform.id ? (
                                    <EditForm
                                      sectionKey={key}
                                      platformId={platform.id}
                                      onClose={() => setEditMode(null)}
                                      onSave={formData => handleSaveEdit(key, platform.id, formData)}
                                    />
                                  ) : (
                                    <div className="space-y-2">
                                      {key === 'accountVerification' && renderSimpleData(data, [
                                        { key: 'method', label: '验证方式' },
                                        { key: 'issues', label: '体验问题' }
                                      ])}

                                      {key === 'payment' && renderPaymentMethods(data)}

                                      {key === 'storage' && renderSimpleData(data, [
                                        { key: 'free', label: '免费保管期' },
                                        { key: 'extended', label: '延长存储' }
                                      ])}

                                      {key === 'qc' && (
                                        <div className="space-y-2 text-sm">
                                          {renderSimpleData(data, [
                                            { key: 'free', label: '免费QC' },
                                            { key: 'extra', label: '额外QC价格' },
                                            { key: 'quality', label: '照片质量' }
                                          ])}
                                          {data?.image && (
                                            <img src={data.image} alt="QC Image" className="mt-2 h-20 w-20 object-contain" />
                                          )}
                                        </div>
                                      )}

                                      {key === 'shipping' && renderSimpleData(data, [
                                        { key: 'rehearsal', label: '预演包裹费' },
                                        { key: 'seizure', label: '海关扣押险' },
                                        { key: 'loss', label: '丢失/损坏险' },
                                        { key: 'delay', label: '延迟险' }
                                      ])}

                                      {key === 'customerService' && renderSimpleData(data, [
                                        { key: 'hours', label: '工作时间' },
                                        { key: 'days', label: '工作日' },
                                        { key: 'response', label: '响应时间' }
                                      ])}

                                      {key === 'discord' && renderSimpleData(data, [
                                        { key: 'members', label: '社区人数' },
                                        { key: 'activities', label: '活动频率' },
                                        { key: 'rewards', label: '奖励形式' },
                                        { key: 'referral', label: '拉新奖励' }
                                      ])}

                                      {key === 'timing' && renderSimpleData(data, [
                                        { key: 'accept', label: '接单时间' },
                                        { key: 'purchase', label: '采购时间' },
                                        { key: 'shipping', label: '卖家发货' },
                                        { key: 'arrival', label: '到仓时间' },
                                        { key: 'qc', label: '质检上架' }
                                      ])}

                                      {key === 'coupon' && renderSimpleData(data, [
                                        { key: 'amount', label: '优惠金额' },
                                        { key: 'type', label: '券码类型' },
                                        { key: 'threshold', label: '使用门槛' },
                                        { key: 'maxDiscount', label: '最高折扣' },
                                        { key: 'stackable', label: '叠加使用' }
                                      ])}

                                      {key === 'language' && data && (
                                        <div className="space-y-3 text-sm">
                                          <div>
                                            <span className="font-medium text-gray-700 block mb-1">支持语言：</span>
                                            <span className="text-gray-600 text-xs">{data.languages}</span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 block mb-1">支持货币：</span>
                                            <span className="text-gray-600 text-xs">{data.currencies}</span>
                                          </div>
                                        </div>
                                      )}

                                      {key === 'commission' && renderSimpleData(data, [
                                        { key: 'base', label: '基础佣金' },
                                        { key: 'max', label: '最高佣金' },
                                        { key: 'mechanism', label: '计算机制' }
                                      ])}

                                      {key === 'membership' && renderSimpleData(data, [
                                        { key: 'points', label: '积分获取' },
                                        { key: 'usage', label: '积分使用' },
                                        { key: 'special', label: '特色功能' }
                                      ])}

                                      {key === 'transshipment' && renderSimpleData(data, [
                                        { key: 'address', label: '转运地址' },
                                        { key: 'requirements', label: '信息要求' }
                                      ])}

                                      {key === 'supportedPlatforms' && data && (
                                        <div className="text-sm">
                                          <span className="font-medium text-gray-700">支持平台：</span>
                                          <div className="mt-1 flex flex-wrap gap-1">
                                            {data.platforms.map(p => (
                                              <span key={p} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                                {p}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {key === 'app' && renderSimpleData(data, [
                                        { key: 'systems', label: '支持系统' },
                                        { key: 'size', label: '安装包大小' },
                                        { key: 'languages', label: '语言货币' },
                                        { key: 'features', label: '特色功能' }
                                      ])}

                                      {key === 'valueAddedService' && data && (
                                        <div className="space-y-3 text-sm">
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
                                      )}

                                      {!data && <span className="text-gray-400 text-sm">数据缺失</span>}
                                    </div>
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
                                onError={(e) => { e.target.src = '/default-favicon.png'; }}
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
                            {platformData.language?.data[platform.id]?.languages.split('：')[0] || '-'}
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
                            {platformData.language?.data[platform.id]?.currencies.split('：')[0] || '-'}
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
