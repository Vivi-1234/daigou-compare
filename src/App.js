import React, { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, Package, Star, Truck, MessageCircle, Users, Clock, Gift, Globe, Percent, Award, ArrowUpDown, Link, Smartphone, Plus, Filter, Eye, ChevronDown, ChevronUp, Edit, Trash, Save, X, Crown, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [selectedPlatforms, setSelectedPlatforms] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [expandedSections, setExpandedSections] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editPlatformId, setEditPlatformId] = useState(null);
  const [newPlatform, setNewPlatform] = useState({ name: '', url: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [advantagePlatforms, setAdvantagePlatforms] = useState({});

  const [platforms, setPlatforms] = useState(() => {
    const saved = localStorage.getItem('platforms');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'mulebuy', url: 'https://mulebuy.com' },
      { id: 2, name: 'cnfans', url: 'https://cnfans.com' },
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
    };
  });

  useEffect(() => {
    localStorage.setItem('platforms', JSON.stringify(platforms));
    localStorage.setItem('platformData', JSON.stringify(platformData));
    localStorage.setItem('advantagePlatforms', JSON.stringify(advantagePlatforms));
  }, [platforms, platformData, advantagePlatforms]);

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

  const handleToggleAdvantage = (sectionKey, platformId) => {
    setAdvantagePlatforms(prev => {
      const newAdvantage = { ...prev };
      if (!newAdvantage[sectionKey]) {
        newAdvantage[sectionKey] = [];
      }
      
      if (newAdvantage[sectionKey].includes(platformId)) {
        newAdvantage[sectionKey] = newAdvantage[sectionKey].filter(id => id !== platformId);
      } else {
        newAdvantage[sectionKey] = [...newAdvantage[sectionKey], platformId];
      }
      
      return newAdvantage;
    });
  };

  const handleImageUpload = (e, setState, key, sectionKey, platformId) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB！');
        return;
      }
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

  const handleDeleteImage = (sectionKey, platformId) => {
    if (window.confirm('确认删除这张图片吗？')) {
      setPlatformData(prev => {
        const updated = { ...prev };
        updated[sectionKey].data[platformId] = { ...updated[sectionKey].data[platformId], image: '' };
        return updated;
      });
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
              {data.platforms.map(p => (
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
                onClick={() => handleDeleteImage(key, data.platformId)}
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

    const handleImageChange = (e, key) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过 5MB！');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          handleChange(key, reader.result);
        };
        reader.onerror = () => console.error('图片读取失败');
        reader.readAsDataURL(file);
      } else {
        alert('请上传图片文件！');
      }
    };

    const handleDeleteImage = () => {
      if (window.confirm('确认删除这张图片吗？')) {
        handleChange('image', '');
      }
    };

    const handleAddField = () => {
      const newFieldName = prompt('请输入新类目名称：');
      if (newFieldName) {
        const fieldType = prompt('请选择类目类型（text/图片）：', 'text');
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
                  onChange={e => handleImageChange(e, field.key)}
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
                      onClick={handleDeleteImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="删除图片"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                value={formData[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  const isAdvantage = (sectionKey, platformId) => {
    return advantagePlatforms[sectionKey]?.includes(platformId) || false;
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
                      <span className="font-medium">{platform.name}</span>
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
                                        onError={(e) => { e.target.src = '/default-favicon.png'; }}
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
