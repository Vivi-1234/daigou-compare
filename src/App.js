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
  const [platforms, setPlatforms] = useState([
    { id: 1, name: 'mulebuy', url: 'https://mulebuy.com' },
    { id: 2, name: 'cnfans', url: 'https://cnfans.com' },
    { id: 3, name: 'Lovegobuy', url: 'https://lovegobuy.com' },
    { id: 4, name: 'Allchinabuy', url: 'https://allchinabuy.com' },
    { id: 5, name: 'hoobuy', url: 'https://hoobuy.com' },
    { id: 6, name: 'kakobuy', url: 'https://kakobuy.com' },
    { id: 7, name: 'oopbuy', url: 'https://oopbuy.com' },
    { id: 8, name: 'Acbuy', url: 'https://acbuy.com' },
    { id: 9, name: 'itaobuy', url: 'https://itaobuy.com' }
  ]);
  const [platformData, setPlatformData] = useState({
    accountVerification: {
      label: '账户验证方式',
      icon: Users,
      data: {
        1: { method: '邮箱点击验证', issues: '链接红色有警告意味', verificationInterface: '', image: '' },
        2: { method: '邮箱点击验证', issues: '有风险提示，发送到垃圾邮箱', verificationInterface: '', image: '' },
        3: { method: '邮箱点击验证', issues: '认证按钮突出，体验较好', verificationInterface: '', image: '' },
        4: { method: '邮箱点击验证', issues: '邮件信息粗糙，链接过长', verificationInterface: '', image: '' },
        5: { method: '验证码验证', issues: '类似短信验证码', verificationInterface: '', image: '' },
        6: { method: '邮箱点击验证', issues: '用户反馈验证麻烦', verificationInterface: '', image: '' },
        7: { method: '验证码验证', issues: '发送到垃圾邮箱，内容不突出', verificationInterface: '', image: '' },
        8: { method: '邮箱点击验证', issues: '链接过长，排版混乱', verificationInterface: '', image: '' },
        9: { method: '邮箱点击验证', issues: '发送到垃圾邮箱，有风险提示', verificationInterface: '', image: '' }
      }
    },
    payment: {
      label: '支付方式',
      icon: CreditCard,
      data: {
        1: { creditCard: ['Visa', 'Discover', 'Mastercard', 'Maestro', 'Diners Club'], eWallet: ['Skrill'], regional: [], other: ['余额支付'], image: '' },
        2: { creditCard: ['Visa', 'Amex', 'JCB', 'Mastercard'], eWallet: ['Google Pay', 'Alipay', 'Skrill'], regional: ['MyBank', 'Mbway', 'Multibanco', 'Neosurf', 'Przelewy24'], other: ['PIX', 'PayU', '余额支付'], image: '' },
        3: { creditCard: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'DC', 'AE'], eWallet: ['Alipay', 'PYUSD', 'Binance'], regional: ['巴西支付(PIX, Boleto, Ame, Picpay等)'], other: ['余额支付'], image: '' },
        4: { creditCard: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'JCB', 'Discover'], eWallet: [], regional: ['PIX', 'PayU'], other: ['余额支付'], image: '' },
        5: { creditCard: ['Visa', 'MasterCard', 'UnionPay', 'JCB', 'Discover', 'Diners Club'], eWallet: ['Alipay'], regional: ['Sofort', 'Sepa', 'Kakao Pay', 'MyBank'], other: ['PIX', '余额支付'], image: '' },
        6: { creditCard: ['Visa', 'Discover', 'Mastercard', 'Maestro', 'Diners Club'], eWallet: ['Google Pay', 'Alipay', 'Skrill', 'CoinPal(TRX,SOL)'], regional: ['Trustly', 'Pix', 'Payu', 'Bancontact', 'iDeal'], other: ['余额支付'], image: '' },
        7: { creditCard: ['Apple', 'Visa', 'Master', 'Discover'], eWallet: [], regional: [], other: ['余额支付'], image: '' },
        8: { creditCard: ['Apple', 'Visa', 'Master', 'Discover'], eWallet: ['Google Pay'], regional: ['PayU'], other: ['PIX', '余额支付'], image: '' },
        9: { creditCard: ['Apple', 'Visa', 'Master', 'Discover'], eWallet: ['Google Pay', 'Skrill'], regional: [], other: ['余额支付'], image: '' }
      }
    },
    storage: {
      label: '保管期',
      icon: Package,
      data: {
        1: { free: '90天', extended: '最长6个月，10元/产品ID/月', image: '' },
        2: { free: '60天', extended: '最长6个月，7元/产品ID/月', image: '' },
        3: { free: '60天', extended: '最长6个月，10元/产品ID/月', image: '' },
        4: { free: '90天', extended: '最长6个月，10元/月', image: '' },
        5: { free: '90天', extended: '最长6个月，0.1元/产品ID/月', image: '' },
        6: { free: '正常180天，异常60天', extended: '20元/订单/100天', image: '' },
        7: { free: '正常90天，异常30天', extended: '最长6个月，10元/产品ID/月', image: '' },
        8: { free: '90天', extended: '最长6个月，10元/产品ID/月', image: '' },
        9: { free: '90天', extended: '10元/月', image: '' }
      }
    },
    qc: {
      label: 'QC质检',
      icon: Star,
      data: {
        1: { free: '3-7张免费', extra: '1.5元/张', quality: '数据缺失', image: '' },
        2: { free: '3-7张免费', extra: '1元/张', quality: '4.09M, 3072*4096像素', image: '' },
        3: { free: '3张免费', extra: '1元/张', quality: '391.42K, 1080*1440像素', image: '' },
        4: { free: '3-5张免费', extra: '2元/张', quality: '1021.83K, 2188*1676像素', image: '' },
        5: { free: '3-4张免费', extra: '1元/张', quality: '294.53K, 1920*1437像素', image: '' },
        6: { free: '3张免费', extra: '1元/张', quality: '3.35M, 4032*3024像素', image: '' },
        7: { free: '6张免费', extra: '1元/张', quality: '355.08K, 1920*1080像素', image: '' },
        8: { free: '3张免费', extra: '2元/张', quality: '2.03M, 1920*1440像素', image: '' },
        9: { free: '3-6张免费', extra: '1元/张', quality: '2.56M, 4032*3024像素', image: '' }
      }
    },
    shipping: {
      label: '运费与保险',
      icon: Truck,
      data: {
        1: { rehearsal: '20元', seizure: '商品价值的3%（最低25元）', loss: '无', delay: '无', image: '' },
        2: { rehearsal: '20元', seizure: '保险费免费', loss: '丢失/损坏可在发货后60天内申请', delay: '无', image: '' },
        3: { rehearsal: '15元', seizure: '无', loss: '无', delay: '无', image: '' },
        4: { rehearsal: '20元', seizure: '最高赔付商品7000元+运费3000元', loss: '最高赔付商品7000元+运费3000元', delay: '未在标准时间内交付，退还20%运费', image: '' },
        5: { rehearsal: '20元', seizure: '保险费=(物品价值+运费)*3%', loss: '丢失/破损赔付需寄送后30天申请', delay: '45天未送达，赔付实际运费20%', image: '' },
        6: { rehearsal: '20元', seizure: '保险费率3%', loss: '丢件/破损需寄送后45天申请', delay: '30天未送达，赔付实际运费20%', image: '' },
        7: { rehearsal: '20元', seizure: '按实付运费15%赔付，最高5000元', loss: '丢失全额退还，轻度损坏送6$优惠券', delay: '分级赔付：1.5倍时效15%，2倍50%，3倍100%', image: '' },
        8: { rehearsal: '20元', seizure: '最高赔付产品7000元+运费3000元', loss: '最高赔付产品7000元+运费3000元', delay: '无', image: '' },
        9: { rehearsal: '无', seizure: '无', loss: '无', delay: '无', image: '' }
      }
    },
    customerService: {
      label: '客服支持',
      icon: MessageCircle,
      data: {
        1: { hours: '9:00-18:00', days: '周一至周日', response: '24小时内', image: '' },
        2: { hours: '9:30-18:00', days: '周一至周五', response: '无官方承诺', image: '' },
        3: { hours: '8:30-19:00', days: '周一至周六', response: '24小时内', image: '' },
        4: { hours: '9:00-18:00', days: '周一至周日', response: '24-48小时内', image: '' },
        5: { hours: '9:00-19:00', days: '周一至周日', response: '24小时内', image: '' },
        6: { hours: '8:00-17:00', days: '周一至周日', response: '无官方承诺', image: '' },
        7: { hours: '9:30-19:00', days: '无官方时间', response: '24小时内', image: '' },
        8: { hours: '9:00-18:00', days: '无官方时间', response: '24-48小时内', image: '' },
        9: { hours: '9:00-18:00', days: '无官方时间', response: '12小时内', image: '' }
      }
    },
    discord: {
      label: 'Discord社区',
      icon: Users,
      data: {
        1: { members: '75,449', activities: '每月1-3个活动，参与人数约1000人', rewards: '优惠券充值+送商品', referral: '邀请5个朋友获100运费优惠', dcLink: '', image: '' },
        2: { members: '337,269', activities: '每月1-2个活动，参与人数约3000人', rewards: '赠予积分+运费折扣', referral: '前几百名邀请可获1000CNY大礼包', dcLink: '', image: '' },
        3: { members: '7,585', activities: '每月1个活动，参与人数约200人', rewards: '优惠券+balance', referral: '邀请3个用户获20%运费折扣', dcLink: '', image: '' },
        4: { members: '103,085', activities: '每月1个活动，参与人数约2000人', rewards: '等级抽奖，免运费+免费商品', referral: '前5名获不同价值现金或代金券', dcLink: '', image: '' },
        5: { members: '52,014', activities: '被Discord封禁', rewards: '被Discord封禁', referral: '被Discord封禁', dcLink: '', image: '' },
        6: { members: '43,550', activities: '每月1个活动，参与人数约1500人', rewards: '免运费+商品充值', referral: '前30名获免运费和3元/邀请', dcLink: '', image: '' },
        7: { members: '54,249', activities: '每月1-2个活动，参与人数约600-700人', rewards: '优惠券+oopbuy硬币', referral: '邀请好友注册获30%运费折扣', dcLink: '', image: '' },
        8: { members: '47,743', activities: '每月1-2个活动，参与人数约200人', rewards: '运费优惠券，商家礼赠', referral: '前5名获不同价值现金或代金券', dcLink: '', image: '' },
        9: { members: '396', activities: '目前只举行了一次', rewards: '运费优惠券', referral: '无', dcLink: '', image: '' }
      }
    },
    timing: {
      label: '时效',
      icon: Clock,
      data: {
        1: { accept: '数据缺失', purchase: '数据缺失', shipping: '数据缺失', arrival: '数据缺失', qc: '数据缺失', image: '' },
        2: { accept: '2小时', purchase: '6小时', shipping: '27小时', arrival: '3-4天', qc: '24小时', image: '' },
        3: { accept: '0.5小时', purchase: '6小时', shipping: '24小时', arrival: '1-3天', qc: '24小时', image: '' },
        4: { accept: '0.5小时', purchase: '不愿透露', shipping: '48小时', arrival: '2天', qc: '48小时', image: '' },
        5: { accept: '0.5小时', purchase: '北京时间8-18点6小时内，18-8点次日14点前', shipping: '淘宝/1688卖家3-7天', arrival: '珠三角1-2天，长三角3-5天，偏远7天', qc: '24小时(工作日)', image: '' },
        6: { accept: '12小时', purchase: '6小时', shipping: '淘宝和1688通常2-7天', arrival: '2天', qc: '24小时', image: '' },
        7: { accept: '6小时', purchase: '6小时', shipping: '淘宝3-7天，京东自营当天', arrival: '珠三角1-2天，长三角3-5天，偏远7天', qc: '24小时', image: '' },
        8: { accept: '0.5小时', purchase: '不愿透露', shipping: '24小时', arrival: '1-3天', qc: '24小时', image: '' },
        9: { accept: '4.5小时', purchase: '6小时', shipping: '24小时', arrival: '3-5天', qc: '48小时', image: '' }
      }
    },
    coupon: {
      label: '优惠券',
      icon: Gift,
      data: {
        1: { amount: '$210优惠券', type: '数据缺失', threshold: '数据缺失', maxDiscount: '数据缺失', stackable: '数据缺失', image: '' },
        2: { amount: '$150优惠券', type: '运费折扣', threshold: '无门槛', maxDiscount: '10.74%', stackable: '不可叠加', image: '' },
        3: { amount: '$210优惠券+30%运费折扣', type: '运费折扣', threshold: '有门槛', maxDiscount: '15%', stackable: '不可叠加', image: '' },
        4: { amount: '$150优惠券', type: '运费折扣', threshold: '有门槛', maxDiscount: '12%', stackable: '不可叠加', image: '' },
        5: { amount: '$200优惠券', type: '运费折扣+商品折扣', threshold: '无门槛', maxDiscount: '10%', stackable: '不可叠加', image: '' },
        6: { amount: '$410优惠券', type: '运费折扣券', threshold: '无门槛', maxDiscount: '12%', stackable: '不可叠加', image: '' },
        7: { amount: '$210优惠券+30%运费折扣', type: '运费折扣券', threshold: '无门槛', maxDiscount: '10%', stackable: '不可叠加', image: '' },
        8: { amount: '$150优惠券', type: '运费折扣券', threshold: '无门槛', maxDiscount: '12%', stackable: '不可叠加', image: '' },
        9: { amount: '$277优惠券', type: '运费折扣', threshold: '最低门槛50CNY', maxDiscount: '40%', stackable: '不可叠加', image: '' }
      }
    },
    language: {
      label: '语言与货币',
      icon: Globe,
      data: {
        1: { languages: '10种：英语、西班牙语、波兰语、瑞典语、中文、法语、葡萄牙语、德语、意大利语、捷克语', currencies: '9种：人民币、加元、英镑、美元、澳元、新西兰元、欧元、波兰兹罗提、瑞士法郎', image: '' },
        2: { languages: '10种：英语、法语、中文、西班牙语、意大利语、德语、葡萄牙语、瑞典语、波兰语、罗马尼亚语', currencies: '9种：人民币、英镑、美元、澳元、新西兰元、欧元、加元、瑞士法郎、波兰兹罗提', image: '' },
        3: { languages: '8种：英语、西班牙语、德语、波兰语、葡萄牙语、意大利语、法语、阿拉伯语', currencies: '5种：美元、英镑、欧元、巴西雷亚尔、波兰兹罗提', image: '' },
        4: { languages: '2种：中文、英文', currencies: '2种：人民币、美元', image: '' },
        5: { languages: '7种：意大利语、德语、法语、西班牙语、英语、波兰语、中文(简体)', currencies: '11种：美元、欧元、澳元、墨西哥比索、韩元、英镑、新西兰元、加元、巴西雷亚尔、人民币、波兰兹罗提', image: '' },
        6: { languages: '16种：简体中文、波兰语、西班牙语、阿拉伯语、中文、俄语、法语、瑞典语、英语、德语、韩语、葡萄牙语、荷兰语、意大利语、日语、罗马尼亚语', currencies: '11种：人民币、英镑、波兰兹罗提、澳元、新西兰元、美元、加元、欧元、新加坡元、瑞士法郎、捷克克朗', image: '' },
        7: { languages: '9种：英语、捷克语、德语、日语、葡萄牙语、简体中文、法语、意大利语、波兰语、西班牙语', currencies: '16种：美元、加元、欧元、墨西哥比索、丹麦克朗、瑞典克朗、韩元、澳元、人民币、日元、新西兰元、波兰兹罗提、瑞士法郎、英镑、挪威克朗', image: '' },
        8: { languages: '4种：英语、波兰语、西班牙文、中文(简体)', currencies: '4种：美元、波兰兹罗提、欧元、人民币', image: '' },
        9: { languages: '2种：中文、英语', currencies: '15种：美元、英镑、欧元、新西兰元、澳元、加元、人民币、墨西哥比索、巴西雷亚尔、韩元、波兰兹罗提、捷克克朗、丹麦克朗、挪威克朗、瑞典克朗', image: '' }
      }
    },
    commission: {
      label: '联盟佣金',
      icon: Percent,
      data: {
        1: { base: '数据缺失', max: '数据缺失', mechanism: '数据缺失', image: '' },
        2: { base: '3%', max: '7%', mechanism: '邀请用户国际物流货运越多，奖励越多', image: '' },
        3: { base: '容易获取较高比例', max: '根据邀请用户数量', mechanism: '邀请用户总运费消费×对应百分比', image: '' },
        4: { base: '3.5%', max: '7.5%', mechanism: '关联用户完成包裹消费时获得奖金', image: '' },
        5: { base: '商品+运费', max: '商品折扣', mechanism: '商品消费及运费消费都计入佣金体系', image: '' },
        6: { base: '3.5%', max: '7.5%', mechanism: '邀请用户支付国际运费×对应佣金比例', image: '' },
        7: { base: '2%', max: '6%', mechanism: '首单5$+订单1%+运费2-6%', image: '' },
        8: { base: '3.5%', max: '7.5%', mechanism: '同Allchinabuy', image: '' },
        9: { base: '4%', max: '9%', mechanism: '累计用户支付运费金额×对应比例', image: '' }
      }
    },
    membership: {
      label: '会员体系',
      icon: Award,
      data: {
        1: { points: '无会员体系', usage: '/', special: '/', image: '' },
        2: { points: '1CNY运费=1积分，100积分=1元', usage: '可兑换商品、增值服务、运费折扣等', special: '可通过余额购买积分', image: '' },
        3: { points: '无会员体系', usage: '/', special: '/', image: '' },
        4: { points: '运费每消费1元积1分', usage: '100积分=1元，可抵扣运费', special: '积分可叠加使用，有效期1年', image: '' },
        5: { points: '无会员体系', usage: '/', special: '/', image: '' },
        6: { points: '无会员体系', usage: '/', special: '/', image: '' },
        7: { points: '成长值=包裹实际支付运费', usage: '实际支付的国际运费', special: '未形成完整会员体系', image: '' },
        8: { points: '无会员体系', usage: '/', special: '/', image: '' },
        9: { points: '积分累计自身消费金额', usage: '增加联盟佣金比例', special: '仅有运费折扣', image: '' }
      }
    },
    transshipment: {
      label: '转运服务',
      icon: Globe,
      data: {
        1: { address: '广东省惠州市惠城区三栋镇', requirements: '目的国家、快递单号、包裹名字', image: '' },
        2: { address: '无', requirements: '无', image: '' },
        3: { address: '无', requirements: '无', image: '' },
        4: { address: '广东省惠州市', requirements: '快递公司、单号、商品链接、类别、数量、单价、备注', image: '' },
        5: { address: '福建省厦门市同安区五显镇', requirements: '快递单号、包裹名字', image: '' },
        6: { address: '厦门市翔安区民安街道', requirements: '快递单号、包裹名字', image: '' },
        7: { address: '福建省厦门市同安区埭头村', requirements: '快递单号、包裹名字', image: '' },
        8: { address: '广东省惠州市', requirements: '物流公司、单号、商品名称、数量、类别、单价、备注', image: '' },
        9: { address: '广东省河源市源城区埔前镇', requirements: '快递单号、备注', image: '' }
      }
    },
    supportedPlatforms: {
      label: '支持链接平台',
      icon: Link,
      data: {
        1: { platforms: ['淘宝', '1688', '微店', '天猫国际'], image: '' },
        2: { platforms: ['淘宝', '1688', '微店'], image: '' },
        3: { platforms: ['淘宝', '1688', '微店', '天猫国际'], image: '' },
        4: { platforms: ['淘宝', '1688', '微店', '天猫国际', '京东', '闲鱼'], image: '' },
        5: { platforms: ['淘宝', '1688', '微店', '天猫国际', '京东'], image: '' },
        6: { platforms: ['淘宝', '1688', '微店', '天猫国际'], image: '' },
        7: { platforms: ['淘宝', '1688', '微店', '天猫国际'], image: '' },
        8: { platforms: ['淘宝', '1688', '微店', '天猫国际', '京东', '闲鱼'], image: '' },
        9: { platforms: ['淘宝', '1688', '微店', '天猫国际'], image: '' }
      }
    },
    app: {
      label: 'APP体验',
      icon: Smartphone,
      data: {
        1: { systems: ['iOS', 'Android'], size: '73MB', languages: '10种语言，10种货币', features: '基础功能', image: '' },
        2: { systems: ['iOS', 'Android'], size: '88MB', languages: '10种语言，9种货币', features: '功能板块多，无乱码', image: '' },
        3: { systems: ['iOS'], size: '11.4MB', languages: '8种语言，5种货币', features: '功能不完善，仅苹果系统', image: '' },
        4: { systems: ['iOS', 'Android'], size: '数据缺失', languages: '2种语言，2种货币', features: '语言和货币种类少', image: '' },
        5: { systems: ['iOS', 'Android'], size: '108MB', languages: '8种语言，11种货币', features: '网页版没有APP二维码', image: '' },
        6: { systems: ['无APP'], size: '/', languages: '/', features: '无APP', image: '' },
        7: { systems: ['iOS', 'Android'], size: '数据缺失', languages: '9种语言，16种货币', features: '货币种类最多，版式舒服', image: '' },
        8: { systems: ['iOS', 'Android'], size: '数据缺失', languages: '仅英语', features: '语言和货币种类少', image: '' },
        9: { systems: ['iOS'], size: '82.6MB', languages: '2种语言', features: '内容简单，与电脑版相同', image: '' }
      }
    },
    valueAddedService: {
      label: '增值服务',
      icon: Plus,
      data: {
        1: { free: '无', paid: '折叠鞋盒3.5元、鞋撑10元、防撞角10元、抽真空20元、加固20元、拉伸膜15元', shipping: '无', image: '' },
        2: { free: '无', paid: '珍珠棉5元、折叠鞋盒3.5元、鞋撑10元、防撞角10元、抽真空20元、加固20元、拉伸膜15元', shipping: '无', image: '' },
        3: { free: '无', paid: '拆除原包装1元', shipping: '无', image: '' },
        4: { free: '去掉吊牌、去掉包装、极简包装', paid: 'EPE珍珠棉23元、防尘袋4元、珍珠棉包装4元、气泡袋3元、气泡柱5元、塑封10元、更改包装2元、拆分订单2元、商品视频20元、剪标3元', shipping: '优先出库10元、EPE泡沫填充3元/kg、纸护角5元/kg、拉伸膜4元/kg、木箱加固250元、防潮袋6元、个性化包装5元、真空压缩17元、折叠鞋盒5元', image: '' },
        5: { free: '纸箱、简易包装、免费鞋撑', paid: '气泡膜4元/kg、防潮袋6元/kg、拉伸膜4元/kg、包装加固10元、角保护20元', shipping: '无', image: '' },
        6: { free: '去标签、去外包装', paid: '鞋撑10元、气泡片5元、压缩袋15元、拉伸膜10元、防潮塑料袋5元、防撞护角10元', shipping: '无', image: '' },
        7: { free: '纸箱包装、极简包装、移除鞋盒、拆除原包装(限时免费)', paid: '鞋撑5元、气泡膜5元、真空袋20元、防潮袋9元、拉伸膜4元/kg、包裹加固5元/kg、角保护8元', shipping: '无', image: '' },
        8: { free: '纸箱包装、极简包装', paid: '金属鞋撑15元、真空袋15元、拉伸缠绕膜10元', shipping: '无', image: '' },
        9: { free: '纸箱包装、极简包装', paid: '气泡片5元、压缩袋15元、防潮塑料袋5元、拉伸缠绕膜10元、防撞护角10元', shipping: '无', image: '' }
      }
    },
    customLogistics: {
      label: '定制物流',
      icon: Settings,
      data: {
        1: { hasService: '/', needInfo: '/', tips: '/', feeDescription: '/', displayInterface: '/', image: '' },
        2: { hasService: '√', needInfo: '未找到', tips: '包裹重量超过30KG或周长较大（单边长度超过120CM）。', feeDescription: '费用说明：定制物流路线初始收取20元操作费，最终运费将在包裹打包后更新', displayInterface: '找不到展示界面 官方提示： 1. 您可以在提交包裹时，在"仓库"页面选择"定制配送"提交申请。 2. 您可以在"运费估算"页面选择"定制配送"提交申请。', image: '' },
        3: { hasService: '√', needInfo: '寄送清单（选择商品） 寄送需求：是否接收多个包裹寄送，期望包装方案（保留/去掉包装），期望寄送方案（运费最便宜，时效最快，综合最优） 申报价值 扣款方式', tips: '1.寄送专家服务费不包含包裹打包及操作费； 2.寄送专家服务申请后，将不会退还服务费用；', feeDescription: '当提交寄送清单的DI数≤10时，收取20元/单的增值服务费； 当提交寄送清单的DI数>10时，在收取20元/单的基础上，每增加一个DI，多收1元的增值服务费。 举例：当用户提交的寄送清单DI数=12时，则专家提包的增值服务费为20+2元。', displayInterface: '1、您可以通过提包页面，在路线中选择"定制物流"提交申请 2、您可以通过运费估算页面进入定制物流的申请页面', image: '' },
        4: { hasService: '√', needInfo: '是直接咨询客服以及whatsapp联系', tips: '无', feeDescription: '费用说明：定制物流路线将会提取收取20元操作费，最终运费将在仓库打包包裹后更新', displayInterface: '', image: '' },
        5: { hasService: '√', needInfo: '联系名称，联系邮箱，联系电话 从仓库选择商品或 手动填写商品信息 商品链接或名称 规格或材质 数量 重量（克） 体积(cm)商品打包后的体积信息', tips: '对于30KG以下的包裹，建议客户选择在线物流配送。', feeDescription: '费用说明：定制物流路线首先收取20元操作费，最终运费将在包裹打包后更新。', displayInterface: '', image: '' },
        6: { hasService: '/', needInfo: '/', tips: '/', feeDescription: '/', displayInterface: '/', image: '' },
        7: { hasService: '√', needInfo: '找不到网站入口', tips: '/', feeDescription: '/', displayInterface: '/', image: '' },
        8: { hasService: '√', needInfo: '/', tips: '/', feeDescription: '/', displayInterface: '/', image: '' },
        9: { hasService: '/', needInfo: '/', tips: '/', feeDescription: '/', displayInterface: '/', image: '' }
      }
    },
    afterSales: {
      label: '售后',
      icon: MessageCircle,
      data: {
        1: { returnFee: '5元手续费,国内运费10cny', returnTime: '5-7天内退换货', processingTime: '7天内', image: '' },
        2: { returnFee: '5元手续费,国内运费不定', returnTime: '5天内退换货', processingTime: '7天内', image: '' },
        3: { returnFee: '5元手续费,国内运费不定', returnTime: '5-7天内退换货', processingTime: '3天内', image: '' },
        4: { returnFee: '5元手续费,国内运费10cny', returnTime: '5-7天内退换货', processingTime: '3天内', image: '' },
        5: { returnFee: '国内运费10cny', returnTime: '5天内退换货', processingTime: '3天内', image: '' },
        6: { returnFee: '5元手续费,国内运费15cny', returnTime: '5-7天内退换货', processingTime: '3天内', image: '' },
        7: { returnFee: '5元手续费,国内运费15cny', returnTime: '5-7天内退换货', processingTime: '无', image: '' },
        8: { returnFee: '5元手续费', returnTime: '5天内退换货', processingTime: '3天内', image: '' },
        9: { returnFee: '5元手续费', returnTime: '包裹售后处理时间', processingTime: '无', image: '' }
      }
    }
  });
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
      showToast('数据加载失败，请检查网络连接');
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
      showToast('管理员登录成功');
    } else {
      showToast('密码错误');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setEditMode(null);
    setEditPlatformId(null);
    showToast('已退出管理员模式');
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
        showToast('平台添加成功');
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
        
        showToast('平台删除成功');
      } catch (error) {
        console.error('删除平台失败:', error);
        showToast('删除平台失败');
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
      showToast('数据保存成功');
    } catch (error) {
      console.error('保存数据失败:', error);
      showToast('保存数据失败');
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
      showToast('优势标记更新成功');
    } catch (error) {
      console.error('更新优势标记失败:', error);
      showToast('更新优势标记失败');
    }
  };

  const handleImageUpload = async (e, sectionKey, platformId, fieldKey) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      showToast('请上传图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过 5MB');
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
      
      showToast('图片上传成功');
    } catch (error) {
      console.error('图片上传失败:', error);
      showToast('图片上传失败');
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
        
        showToast('图片删除成功');
      } catch (error) {
        console.error('删除图片失败:', error);
        showToast('删除图片失败');
      }
    }
  };

  const handleAddSection = async () => {
    if (!newSection.label) {
      showToast('请输入板块名称');
      return;
    }

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

      setSectionConfigs(prev => ({
        ...prev,
        [sectionKey]: {
          label: newSection.label,
          icon: getIconComponent(newSection.icon),
          displayOrder: maxOrder + 1
        }
      }));

      setPlatformData(prev => ({
        ...prev,
        [sectionKey]: {
          label: newSection.label,
          icon: getIconComponent(newSection.icon),
          data: platforms.reduce((acc, platform) => ({
            ...acc,
            [platform.id]: {}
          }), {})
        }
      }));

      setShowNewSectionModal(false);
      setNewSection({ key: '', label: '', icon: 'Package' });
      showToast('板块添加成功');
    } catch (error) {
      console.error('添加板块失败:', error);
      showToast('添加板块失败');
    }
  };

  const handleDeleteSection = async (sectionKey) => {
    if (window.confirm(`确认删除板块 "${sectionConfigs[sectionKey]?.label}" 吗？这将删除该板块的所有数据！`)) {
      try {
        await supabase.deleteSectionConfig(sectionKey);
        setSectionConfigs(prev => {
          const updated = { ...prev };
          delete updated[sectionKey];
          return updated;
        });
        setPlatformData(prev => {
          const updated = { ...prev };
          delete updated[sectionKey];
          return updated;
        });
        setFieldConfigs(prev => {
          const updated = { ...prev };
          delete updated[sectionKey];
          return updated;
        });
        showToast('板块删除成功');
      } catch (error) {
        console.error('删除板块失败:', error);
        showToast('删除板块失败');
      }
    }
  };

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

      const promises = platforms.map(platform => {
        const currentData = { ...platformData[sectionKey].data[platform.id] };
        currentData[fieldKey] = fieldType === 'image' ? '' : '';
        return supabase.upsertPlatformData(sectionKey, platform.id, currentData);
      });

      await Promise.all(promises);
      
      setPlatformData(prev => {
        const updated = { ...prev };
        platforms.forEach(platform => {
          if (updated[sectionKey] && updated[sectionKey].data[platform.id]) {
            updated[sectionKey].data[platform.id][fieldKey] = fieldType === 'image' ? '' : '';
          }
        });
        return updated;
      });
      
      showToast('字段已添加到所有平台');
    } catch (error) {
      console.error('添加字段失败:', error);
      throw error;
    }
  };

  const handleDeleteFieldFromAllPlatforms = async (sectionKey, fieldKey) => {
    if (window.confirm(`确认删除字段 "${getFieldLabel(fieldKey)}" 吗？这将从所有平台中删除该字段！`)) {
      try {
        await supabase.deleteFieldConfig(sectionKey, fieldKey);

        const promises = platforms.map(platform => {
          const currentData = { ...platformData[sectionKey].data[platform.id] };
          delete currentData[fieldKey];
          return supabase.upsertPlatformData(sectionKey, platform.id, currentData);
        });

        await Promise.all(promises);

        setFieldConfigs(prev => {
          const updated = { ...prev };
          if (updated[sectionKey]) {
            const newSectionFields = { ...updated[sectionKey] };
            delete newSectionFields[fieldKey];
            updated[sectionKey] = newSectionFields;
          }
          return updated;
        });

        setPlatformData(prev => {
          const updated = { ...prev };
          platforms.forEach(platform => {
            if (updated[sectionKey] && updated[sectionKey].data[platform.id]) {
              delete updated[sectionKey].data[platform.id][fieldKey];
            }
          });
          return updated;
        });

        showToast('字段删除成功');
      } catch (error) {
        console.error('删除字段失败:', error);
        showToast('删除字段失败');
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

    const generateFieldKey = (label) => {
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
      
      let result = label;
      Object.keys(pinyinMap).forEach(cn => {
        result = result.replace(new RegExp(cn, 'g'), pinyinMap[cn]);
      });
      
      if (/[\u4e00-\u9fa5]/.test(result)) {
        result = `field_${Date.now()}`;
      }
      
      result = result.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      return result;
    };

    const handleAddField = async () => {
      if (!newFieldLabel) {
        showToast('请输入字段名称');
        return;
      }
      
      const newFieldKey = generateFieldKey(newFieldLabel);
      
      if (currentFields[newFieldKey]) {
        showToast('该字段已存在');
        return;
      }

      try {
        await handleAddFieldToAllPlatforms(sectionKey, newFieldKey, newFieldLabel, newFieldType);
        setNewFieldLabel('');
        setNewFieldType('text');
        setFormData(prev => ({
          ...prev,
          [newFieldKey]: newFieldType === 'image' ? '' : ''
        }));
        showToast('字段添加成功');
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

        {showSuccessToast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn z-50">
            {toastMessage}
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
