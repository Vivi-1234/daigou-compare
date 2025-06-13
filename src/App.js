import React, { useState } from 'react';
import { ShoppingCart, CreditCard, Package, Star, Truck, MessageCircle, Users, Clock, Gift, Globe, Percent, Award, ArrowUpDown, Link, Smartphone, Plus, Filter, Eye, ChevronDown, ChevronUp } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [selectedPlatforms, setSelectedPlatforms] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [expandedSections, setExpandedSections] = useState({});

  const platforms = [
    { id: 1, name: 'cnfans', logo: '🇨🇳' },
    { id: 2, name: 'mulebuy', logo: '🐴' },
    { id: 3, name: 'Lovegobuy', logo: '❤️' },
    { id: 4, name: 'Allchinabuy', logo: '🏮' },
    { id: 5, name: 'hoobuy', logo: '🦉' },
    { id: 6, name: 'kakobuy', logo: '🌸' },
    { id: 7, name: 'oopbuy', logo: '🎯' },
    { id: 8, name: 'Acbuy', logo: '⚡' },
    { id: 9, name: 'itaobuy', logo: '🛒' }
  ];

  // 详细数据 (保持不变，省略以节省空间)
  const platformData = {
    accountVerification: {
      label: '账户验证方式',
      icon: Users,
      data: {
        1: { method: '邮箱点击验证', issues: '有风险提示，发送到垃圾邮箱' },
        2: { method: '邮箱点击验证', issues: '链接红色有警告意味' },
        3: { method: '邮箱点击验证', issues: '认证按钮突出，体验较好' },
        4: { method: '邮箱点击验证', issues: '邮件信息粗糙，链接过长' },
        5: { method: '验证码验证', issues: '类似短信验证码' },
        6: { method: '邮箱点击验证', issues: '用户反馈验证麻烦' },
        7: { method: '验证码验证', issues: '发送到垃圾邮箱，内容不突出' },
        8: { method: '邮箱点击验证', issues: '链接过长，排版混乱' },
        9: { method: '邮箱点击验证', issues: '发送到垃圾邮箱，有风险提示' }
      }
    },
    payment: {
      label: '支付方式',
      icon: CreditCard,
      data: {
        1: {
          creditCard: ['Visa', 'Amex', 'JCB', 'Mastercard'],
          eWallet: ['Google Pay', 'Alipay', 'Skrill'],
          regional: ['MyBank', 'Mbway', 'Multibanco', 'Neosurf', 'Przelewy24'],
          other: ['PIX', 'PayU', '余额支付']
        },
        // ... 其他支付数据 (省略)
      }
    },
    // ... 其他 section 数据 (省略以节省空间)
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-4">
          <TabButton id="comparison" label="平台对比" icon={ArrowUpDown} />
          <TabButton id="quick-view" label="快速查看" icon={Eye} />
        </div>

        {/* Platform Selector */}
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

        {/* Comparison Tab */}
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
                                  <div className="flex items-center mb-3 pb-3 border-b border-gray-200">
                                    <span className="text-2xl mr-2">{platform.logo}</span>
                                    <h4 className="font-bold text-gray-900 text-lg">{platform.name}</h4>
                                  </div>
                                  
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
                                    
                                    {/* 其他 section 的渲染逻辑 (省略以节省空间，保持与原代码一致) */}
                                    
                                    {!data && <span className="text-gray-400 text-sm">数据缺失</span>}
                                  </div>
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

        {/* Quick View Tab */}
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
                              <span className="text-2xl mr-2">{platform.logo}</span>
                              <span>{platform.name}</span>
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
