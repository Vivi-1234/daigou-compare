import React, { useState } from 'react';
import { PlusCircle, Edit3, Trash2, BarChart3, TrendingUp, ShoppingCart, CreditCard, Truck, Star, Shield, Globe, MessageCircle, Users, Gift, Coins, Camera, Upload, Settings, Eye, EyeOff, Save, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('viewer'); // 'admin' or 'viewer'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [editingPlatform, setEditingPlatform] = useState(null);
  
  const [platforms, setPlatforms] = useState([
    {
      id: 1,
      name: 'cnfans',
      logo: '🇨🇳',
      accountMethod: '邮箱注册',
      paymentMethod: 'PayPal, 信用卡, 支付宝',
      salesTax: '免税',
      insurance: '有',
      qc: '免费QC',
      shipping: 'EMS, DHL, 顺丰',
      customerService: '24/7在线客服',
      dc: '多个仓库',
      timeLimit: '30天',
      coupon: '新用户8折',
      language: '中英文',
      unionPay: '支持',
      membership: 'VIP会员制',
      integration: '微信小程序',
      customizable: '可定制服务',
      app: 'iOS/Android',
      valueAddedService: '包装服务',
      customGoods: '支持定制商品',
      status: 'excellent',
      images: {}
    },
    {
      id: 2,
      name: 'mulebuy',
      logo: '🐴',
      accountMethod: '手机号注册',
      paymentMethod: 'PayPal, 银行卡',
      salesTax: '5%',
      insurance: '可选',
      qc: '付费QC',
      shipping: 'EUB, SAL',
      customerService: '工作时间客服',
      dc: '单一仓库',
      timeLimit: '15天',
      coupon: '满减优惠',
      language: '英文',
      unionPay: '不支持',
      membership: '积分制',
      integration: '无',
      customizable: '标准服务',
      app: 'Web版',
      valueAddedService: '保险服务',
      customGoods: '不支持',
      status: 'good',
      images: {}
    },
    {
      id: 3,
      name: 'Lovegobuy',
      logo: '❤️',
      accountMethod: '社交账号登录',
      paymentMethod: 'PayPal, Stripe',
      salesTax: '免税',
      insurance: '有',
      qc: '免费QC',
      shipping: 'DHL, FedEx',
      customerService: '多语言客服',
      dc: '欧美仓库',
      timeLimit: '45天',
      coupon: '首单免运费',
      language: '多语言',
      unionPay: '支持',
      membership: '会员等级制',
      integration: 'Telegram',
      customizable: '高度定制',
      app: 'PWA应用',
      valueAddedService: '快递跟踪',
      customGoods: '支持定制',
      status: 'excellent',
      images: {}
    },
    {
      id: 4,
      name: 'Allchinabuy',
      logo: '🏮',
      accountMethod: '邮箱注册',
      paymentMethod: '支付宝, 微信支付',
      salesTax: '0%',
      insurance: '包含',
      qc: '专业QC',
      shipping: '顺丰, 中通',
      customerService: '中文客服',
      dc: '华南仓储',
      timeLimit: '60天',
      coupon: '会员专享',
      language: '中文',
      unionPay: '支持',
      membership: '钻石会员',
      integration: '微信群',
      customizable: '完全定制',
      app: '小程序',
      valueAddedService: '验货拍照',
      customGoods: '全面支持',
      status: 'excellent',
      images: {}
    },
    {
      id: 5,
      name: 'hoobuy',
      logo: '🦉',
      accountMethod: '快速注册',
      paymentMethod: 'PayPal, 加密货币',
      salesTax: '2%',
      insurance: '可选',
      qc: '基础QC',
      shipping: 'EMS, ePacket',
      customerService: 'AI客服+人工',
      dc: '智能仓储',
      timeLimit: '21天',
      coupon: '新人大礼包',
      language: '英文',
      unionPay: '不支持',
      membership: '积分兑换',
      integration: 'Discord',
      customizable: '模块化定制',
      app: 'Web App',
      valueAddedService: '智能推荐',
      customGoods: '部分支持',
      status: 'good',
      images: {}
    },
    {
      id: 6,
      name: 'kakobuy',
      logo: '🌸',
      accountMethod: '邮箱/手机',
      paymentMethod: 'PayPal, 信用卡',
      salesTax: '3%',
      insurance: '有',
      qc: '免费QC',
      shipping: 'DHL, EMS',
      customerService: '在线客服',
      dc: '日韩仓库',
      timeLimit: '25天',
      coupon: '首购优惠',
      language: '中日韩',
      unionPay: '支持',
      membership: '积分会员',
      integration: 'Line',
      customizable: '部分定制',
      app: 'App',
      valueAddedService: '代付服务',
      customGoods: '支持',
      status: 'good',
      images: {}
    },
    {
      id: 7,
      name: 'oopbuy',
      logo: '🎯',
      accountMethod: '快速注册',
      paymentMethod: 'PayPal, 支付宝',
      salesTax: '免税',
      insurance: '可选',
      qc: '付费QC',
      shipping: 'EMS, 顺丰',
      customerService: '工作时间',
      dc: '华东仓库',
      timeLimit: '20天',
      coupon: '新用户礼包',
      language: '中英文',
      unionPay: '支持',
      membership: '等级制',
      integration: 'QQ群',
      customizable: '标准服务',
      app: 'H5',
      valueAddedService: '质检服务',
      customGoods: '部分支持',
      status: 'average',
      images: {}
    },
    {
      id: 8,
      name: 'Acbuy',
      logo: '⚡',
      accountMethod: '邮箱注册',
      paymentMethod: 'PayPal, 银行转账',
      salesTax: '4%',
      insurance: '有',
      qc: '专业QC',
      shipping: 'DHL, FedEx',
      customerService: '24小时',
      dc: '欧美仓',
      timeLimit: '35天',
      coupon: '会员专享',
      language: '多语言',
      unionPay: '不支持',
      membership: 'VIP制',
      integration: 'Telegram',
      customizable: '高度定制',
      app: 'App',
      valueAddedService: '专属客服',
      customGoods: '全面支持',
      status: 'excellent',
      images: {}
    },
    {
      id: 9,
      name: 'itaobuy',
      logo: '🛒',
      accountMethod: '手机注册',
      paymentMethod: '支付宝, 微信',
      salesTax: '1%',
      insurance: '包含',
      qc: '免费QC',
      shipping: '顺丰, 中通',
      customerService: '中文客服',
      dc: '国内多仓',
      timeLimit: '45天',
      coupon: '满减活动',
      language: '中文',
      unionPay: '支持',
      membership: '钻石VIP',
      integration: '微信群',
      customizable: '完全定制',
      app: '小程序+App',
      valueAddedService: '一站式服务',
      customGoods: '定制专家',
      status: 'excellent',
      images: {}
    }
  ]);

  const [selectedPlatforms, setSelectedPlatforms] = useState([1, 2, 3]);
  const [editingImage, setEditingImage] = useState(null);

  // 管理员登录
  const handleLogin = () => {
    if (loginPassword === 'admin123') {
      setUserRole('admin');
      setIsLoginModalOpen(false);
      setLoginPassword('');
    } else {
      alert('密码错误！');
    }
  };

  // 登出
  const handleLogout = () => {
    setUserRole('viewer');
  };

  // 保存平台编辑
  const savePlatformEdit = () => {
    if (editingPlatform) {
      setPlatforms(platforms.map(p => 
        p.id === editingPlatform.id ? editingPlatform : p
      ));
      setEditingPlatform(null);
    }
  };

  // 取消编辑
  const cancelPlatformEdit = () => {
    setEditingPlatform(null);
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

  const MetricCard = ({ title, value, icon: Icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );

  const PlatformCard = ({ platform }) => {
    const statusColors = {
      excellent: 'from-green-400 to-emerald-600',
      good: 'from-blue-400 to-blue-600',
      average: 'from-yellow-400 to-orange-500'
    };

    const isEditing = editingPlatform && editingPlatform.id === platform.id;
    const displayPlatform = isEditing ? editingPlatform : platform;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl bg-gray-50 rounded-xl p-3">
              {isEditing ? (
                <input
                  type="text"
                  value={displayPlatform.logo}
                  onChange={(e) => setEditingPlatform({...editingPlatform, logo: e.target.value})}
                  className="w-12 text-center text-2xl bg-transparent border-none outline-none"
                />
              ) : (
                displayPlatform.logo
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={displayPlatform.name}
                  onChange={(e) => setEditingPlatform({...editingPlatform, name: e.target.value})}
                  className="text-xl font-bold text-gray-900 bg-gray-50 rounded px-2 py-1 border"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-900">{displayPlatform.name}</h3>
              )}
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${statusColors[displayPlatform.status]} text-white mt-1`}>
                {displayPlatform.status === 'excellent' ? '推荐' : displayPlatform.status === 'good' ? '良好' : '一般'}
              </div>
            </div>
          </div>
          {userRole === 'admin' && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={savePlatformEdit}
                    className="p-2 text-green-600 hover:text-green-700 transition-colors rounded-lg hover:bg-green-50"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={cancelPlatformEdit}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setEditingPlatform({...platform})}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span>{displayPlatform.accountMethod}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CreditCard className="w-4 h-4 mr-2 text-green-500" />
              <span>{displayPlatform.paymentMethod.split(',')[0]}...</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <span>{displayPlatform.qc}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Truck className="w-4 h-4 mr-2 text-purple-500" />
              <span>{displayPlatform.timeLimit}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const comparisonFields = [
    { key: 'accountMethod', label: '账户注册方式', icon: Users, color: 'blue' },
    { key: 'paymentMethod', label: '支付方式', icon: CreditCard, color: 'green' },
    { key: 'salesTax', label: '销售税', icon: Coins, color: 'yellow' },
    { key: 'insurance', label: '保险期', icon: Shield, color: 'purple' },
    { key: 'qc', label: 'QC质检', icon: Star, color: 'orange' },
    { key: 'shipping', label: '物流方式', icon: Truck, color: 'indigo' },
    { key: 'customerService', label: '客服支持', icon: MessageCircle, color: 'pink' },
    { key: 'dc', label: '仓储中心', icon: Globe, color: 'teal' },
    { key: 'timeLimit', label: '时效期限', icon: TrendingUp, color: 'red' },
    { key: 'coupon', label: '优惠活动', icon: Gift, color: 'emerald' },
    { key: 'language', label: '语言货币', icon: Globe, color: 'cyan' },
    { key: 'unionPay', label: '银联支付', icon: CreditCard, color: 'lime' },
    { key: 'membership', label: '会员体系', icon: Users, color: 'violet' },
    { key: 'integration', label: '平台集成', icon: Truck, color: 'rose' },
    { key: 'customizable', label: '定制化服务', icon: BarChart3, color: 'amber' },
    { key: 'app', label: '移动应用', icon: ShoppingCart, color: 'sky' },
    { key: 'valueAddedService', label: '增值服务', icon: Star, color: 'fuchsia' },
    { key: 'customGoods', label: '定制商品', icon: Gift, color: 'slate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Admin Controls */}
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 right-0">
            {userRole === 'admin' ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">管理员模式</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  切换查看模式
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                管理员登录
              </button>
            )}
          </div>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            代购平台对比分析
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            智能对比主流代购平台的各项服务指标，为您的跨境购物提供最佳决策支持
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <TabButton id="overview" label="平台概览" icon={BarChart3} />
          <TabButton id="comparison" label="详细对比" icon={ShoppingCart} />
          <TabButton id="analysis" label="数据分析" icon={TrendingUp} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard 
                title="平台总数" 
                value={platforms.length} 
                icon={ShoppingCart} 
                gradient="from-blue-500 to-blue-600"
              />
              <MetricCard 
                title="支持PayPal" 
                value={platforms.filter(p => p.paymentMethod.includes('PayPal')).length} 
                icon={CreditCard} 
                gradient="from-green-500 to-emerald-600"
              />
              <MetricCard 
                title="免费QC" 
                value={platforms.filter(p => p.qc.includes('免费')).length} 
                icon={Star} 
                gradient="from-yellow-500 to-orange-600"
              />
              <MetricCard 
                title="推荐平台" 
                value={platforms.filter(p => p.status === 'excellent').length} 
                icon={TrendingUp} 
                gradient="from-purple-500 to-pink-600"
              />
            </div>

            {/* Platform Cards */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">代购平台列表</h2>
                {userRole === 'admin' && (
                  <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    添加平台
                  </button>
                )}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {platforms.map((platform) => (
                  <PlatformCard key={platform.id} platform={platform} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            {/* Platform Selector */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-500" />
                选择对比平台
              </h3>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <label key={platform.id} className="flex items-center cursor-pointer">
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
                      <span className="text-lg mr-2">{platform.logo}</span>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  详细对比分析
                </h2>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-bold text-gray-900 w-48 bg-gray-50 rounded-tl-xl">
                          对比维度
                        </th>
                        {platforms.filter(p => selectedPlatforms.includes(p.id)).map((platform, index) => (
                          <th key={platform.id} className={`text-center py-4 px-6 font-bold text-gray-900 min-w-48 bg-gray-50 ${
                            index === platforms.filter(p => selectedPlatforms.includes(p.id)).length - 1 ? 'rounded-tr-xl' : ''
                          }`}>
                            <div className="flex items-center justify-center">
                              <span className="text-2xl mr-2">{platform.logo}</span>
                              <span>{platform.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFields.map((field, index) => (
                        <tr key={field.key} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                        }`}>
                          <td className="py-4 px-6 font-semibold text-gray-800">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg bg-${field.color}-100 mr-3`}>
                                <field.icon className={`w-4 h-4 text-${field.color}-600`} />
                              </div>
                              {field.label}
                            </div>
                          </td>
                          {platforms.filter(p => selectedPlatforms.includes(p.id)).map((platform) => (
                            <td key={platform.id} className="py-4 px-6">
                              <div className="text-center space-y-3">
                                <div className="font-medium text-gray-700 bg-white/80 rounded-lg p-2 shadow-sm">
                                  {platform[field.key]}
                                </div>
                                {userRole === 'admin' && (
                                  <>
                                    {platform.images[field.key] ? (
                                      <div className="relative inline-block">
                                        <img 
                                          src={platform.images[field.key]} 
                                          alt={`${platform.name} ${field.label}`}
                                          className="w-20 h-20 object-cover rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                                          onClick={() => setEditingImage({platformId: platform.id, field: field.key})}
                                        />
                                        <button
                                          onClick={() => {
                                            const newPlatforms = platforms.map(p => 
                                              p.id === platform.id 
                                                ? {...p, images: {...p.images, [field.key]: null}}
                                                : p
                                            );
                                            setPlatforms(newPlatforms);
                                          }}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setEditingImage({platformId: platform.id, field: field.key})}
                                        className="w-20 h-20 mx-auto border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                                      >
                                        <Camera className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                                      </button>
                                    )}
                                  </>
                                )}
                                {userRole === 'viewer' && platform.images[field.key] && (
                                  <img 
                                    src={platform.images[field.key]} 
                                    alt={`${platform.name} ${field.label}`}
                                    className="w-20 h-20 object-cover rounded-xl shadow-md mx-auto"
                                  />
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Analysis */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-100 rounded-xl mr-4">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">支付方式分析</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: '支持PayPal', count: platforms.filter(p => p.paymentMethod.includes('PayPal')).length, color: 'blue' },
                    { label: '支持信用卡', count: platforms.filter(p => p.paymentMethod.includes('信用卡')).length, color: 'green' },
                    { label: '支持支付宝', count: platforms.filter(p => p.paymentMethod.includes('支付宝')).length, color: 'orange' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-white/80 rounded-xl">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <div className="flex items-center">
                        <div className={`w-32 bg-gray-200 rounded-full h-3 mr-3`}>
                          <div 
                            className={`bg-${item.color}-500 h-3 rounded-full transition-all duration-500`}
                            style={{width: `${(item.count / platforms.length) * 100}%`}}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-900 min-w-[3rem]">{item.count}个</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Analysis */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl mr-4">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">服务特色分析</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: '免费QC', count: platforms.filter(p => p.qc.includes('免费')).length, color: 'yellow' },
                    { label: '包含保险', count: platforms.filter(p => p.insurance === '有' || p.insurance === '包含').length, color: 'purple' },
                    { label: '支持定制', count: platforms.filter(p => p.customGoods.includes('支持')).length, color: 'pink' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-white/80 rounded-xl">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <div className="flex items-center">
                        <div className={`w-32 bg-gray-200 rounded-full h-3 mr-3`}>
                          <div 
                            className={`bg-${item.color}-500 h-3 rounded-full transition-all duration-500`}
                            style={{width: `${(item.count / platforms.length) * 100}%`}}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-900 min-w-[3rem]">{item.count}个</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Summary Cards */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">平台综合评价</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <div key={platform.id} className="bg-white/80 rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">{platform.logo}</div>
                      <h4 className="text-lg font-bold text-gray-900">{platform.name}</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">注册方式</span>
                        <span className="font-medium text-gray-900">{platform.accountMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">QC服务</span>
                        <span className="font-medium text-gray-900">{platform.qc}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">保险</span>
                        <span className="font-medium text-gray-900">{platform.insurance}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">时效</span>
                        <span className="font-medium text-gray-900">{platform.timeLimit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">管理员登录</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">管理员密码</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="请输入管理员密码"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <p className="text-xs text-gray-500 mt-1">提示：默认密码为 admin123</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  登录
                </button>
                <button
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setLoginPassword('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {editingImage && userRole === 'admin' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                为 <span className="text-blue-600">{platforms.find(p => p.id === editingImage.platformId)?.name}</span> 
                的 <span className="text-purple-600">{comparisonFields.find(f => f.key === editingImage.field)?.label}</span> 添加图片
              </h3>
              
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('imageInput').click()}>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-blue-50 rounded-full">
                        <Upload className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">点击上传图片文件</p>
                      <p className="text-sm text-gray-500 mt-1">或拖拽图片到此处</p>
                    </div>
                    <p className="text-xs text-gray-400">支持 PNG, JPG, GIF 格式，最大 10MB</p>
                  </div>
                  <input
                    id="imageInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const newPlatforms = platforms.map(p => 
                            p.id === editingImage.platformId 
                              ? {...p, images: {...p.images, [editingImage.field]: e.target.result}}
                              : p
                          );
                          setPlatforms(newPlatforms);
                          setEditingImage(null);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">或者</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">输入图片链接</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        const newPlatforms = platforms.map(p => 
                          p.id === editingImage.platformId 
                            ? {...p, images: {...p.images, [editingImage.field]: e.target.value}}
                            : p
                        );
                        setPlatforms(newPlatforms);
                        setEditingImage(null);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">按回车键确认添加</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setEditingImage(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;