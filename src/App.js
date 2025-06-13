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
        2: {
          creditCard: ['Visa', 'Discover', 'Mastercard', 'Maestro', 'Diners Club'],
          eWallet: ['Skrill'],
          regional: [],
          other: ['余额支付']
        },
        3: {
          creditCard: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'DC', 'AE'],
          eWallet: ['Alipay', 'PYUSD', 'Binance'],
          regional: ['巴西支付(PIX, Boleto, Ame, Picpay等)'],
          other: ['余额支付']
        },
        4: {
          creditCard: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'JCB', 'Discover'],
          eWallet: [],
          regional: ['PIX', 'PayU'],
          other: ['余额支付']
        },
        5: {
          creditCard: ['Visa', 'MasterCard', 'UnionPay', 'JCB', 'Discover', 'Diners Club'],
          eWallet: ['Alipay'],
          regional: ['Sofort', 'Sepa', 'Kakao Pay', 'MyBank'],
          other: ['PIX', '余额支付']
        },
        6: {
          creditCard: ['Visa', 'Discover', 'Mastercard', 'Maestro', 'Diners Club'],
          eWallet: ['Google Pay', 'Alipay', 'Skrill', 'CoinPal(TRX,SOL)'],
          regional: ['Trustly', 'Pix', 'Payu', 'Bancontact', 'iDeal'],
          other: ['余额支付']
        },
        7: {
          creditCard: ['Apple', 'Visa', 'Master', 'Discover'],
          eWallet: [],
          regional: [],
          other: ['余额支付']
        },
        8: {
          creditCard: ['Apple', 'Visa', 'Master', 'Discover'],
          eWallet: ['Google Pay'],
          regional: ['PayU'],
          other: ['PIX', '余额支付']
        },
        9: {
          creditCard: ['Apple', 'Visa', 'Master', 'Discover'],
          eWallet: ['Google Pay', 'Skrill'],
          regional: [],
          other: ['余额支付']
        }
      }
    },
    storage: {
      label: '保管期',
      icon: Package,
      data: {
        1: { free: '60天', extended: '最长6个月，7元/产品ID/月' },
        2: { free: '90天', extended: '最长6个月，10元/产品ID/月' },
        3: { free: '60天', extended: '最长6个月，10元/产品ID/月' },
        4: { free: '90天', extended: '最长6个月，10元/月' },
        5: { free: '90天', extended: '最长6个月，0.1元/产品ID/月' },
        6: { free: '正常180天，异常60天', extended: '20元/订单/100天' },
        7: { free: '正常90天，异常30天', extended: '最长6个月，10元/产品ID/月' },
        8: { free: '90天', extended: '最长6个月，10元/产品ID/月' },
        9: { free: '90天', extended: '10元/月' }
      }
    },
    qc: {
      label: 'QC质检',
      icon: Star,
      data: {
        1: { free: '3-7张免费', extra: '1元/张', quality: '4.09M, 3072*4096像素' },
        2: { free: '3-7张免费', extra: '1.5元/张', quality: '数据缺失' },
        3: { free: '3张免费', extra: '1元/张', quality: '391.42K, 1080*1440像素' },
        4: { free: '3-5张免费', extra: '2元/张', quality: '1021.83K, 2188*1676像素' },
        5: { free: '3-4张免费', extra: '1元/张', quality: '294.53K, 1920*1437像素' },
        6: { free: '3张免费', extra: '1元/张', quality: '3.35M, 4032*3024像素' },
        7: { free: '6张免费', extra: '1元/张', quality: '355.08K, 1920*1080像素' },
        8: { free: '3张免费', extra: '2元/张', quality: '2.03M, 1920*1440像素' },
        9: { free: '3-6张免费', extra: '1元/张', quality: '2.56M, 4032*3024像素' }
      }
    },
    shipping: {
      label: '运费与保险',
      icon: Truck,
      data: {
        1: { 
          rehearsal: '20元', 
          seizure: '保险费免费', 
          loss: '丢失/损坏可在发货后60天内申请', 
          delay: '无' 
        },
        2: { 
          rehearsal: '20元', 
          seizure: '商品价值的3%（最低25元）', 
          loss: '无', 
          delay: '无' 
        },
        3: { 
          rehearsal: '15元', 
          seizure: '无', 
          loss: '无', 
          delay: '无' 
        },
        4: { 
          rehearsal: '20元', 
          seizure: '最高赔付商品7000元+运费3000元', 
          loss: '最高赔付商品7000元+运费3000元', 
          delay: '未在标准时间内交付，退还20%运费' 
        },
        5: { 
          rehearsal: '20元', 
          seizure: '保险费=(物品价值+运费)*3%', 
          loss: '丢失/破损赔付需寄送后30天申请', 
          delay: '45天未送达，赔付实际运费20%' 
        },
        6: { 
          rehearsal: '20元', 
          seizure: '保险费率3%', 
          loss: '丢件/破损需寄送后45天申请', 
          delay: '30天未送达，赔付实际运费20%' 
        },
        7: { 
          rehearsal: '20元', 
          seizure: '按实付运费15%赔付，最高5000元', 
          loss: '丢失全额退还，轻度损坏送6$优惠券', 
          delay: '分级赔付：1.5倍时效15%，2倍50%，3倍100%' 
        },
        8: { 
          rehearsal: '20元', 
          seizure: '最高赔付产品7000元+运费3000元', 
          loss: '最高赔付产品7000元+运费3000元', 
          delay: '无' 
        },
        9: { 
          rehearsal: '无', 
          seizure: '无', 
          loss: '无', 
          delay: '无' 
        }
      }
    },
    customerService: {
      label: '客服支持',
      icon: MessageCircle,
      data: {
        1: { hours: '9:30-18:00', days: '周一至周五', response: '无官方承诺' },
        2: { hours: '9:00-18:00', days: '周一至周日', response: '24小时内' },
        3: { hours: '8:30-19:00', days: '周一至周六', response: '24小时内' },
        4: { hours: '9:00-18:00', days: '周一至周日', response: '24-48小时内' },
        5: { hours: '9:00-19:00', days: '周一至周日', response: '24小时内' },
        6: { hours: '8:00-17:00', days: '周一至周日', response: '无官方承诺' },
        7: { hours: '9:30-19:00', days: '无官方时间', response: '24小时内' },
        8: { hours: '9:00-18:00', days: '无官方时间', response: '24-48小时内' },
        9: { hours: '9:00-18:00', days: '无官方时间', response: '12小时内' }
      }
    },
    discord: {
      label: 'Discord社区',
      icon: Users,
      data: {
        1: { 
          members: '337,269', 
          activities: '每月1-2个活动，参与人数约3000人',
          rewards: '赠予积分+运费折扣',
          referral: '前几百名邀请可获1000CNY大礼包'
        },
        2: { 
          members: '75,449', 
          activities: '每月1-3个活动，参与人数约1000人',
          rewards: '优惠券充值+送商品',
          referral: '邀请5个朋友获100运费优惠'
        },
        3: { 
          members: '7,585', 
          activities: '每月1个活动，参与人数约200人',
          rewards: '优惠券+balance',
          referral: '邀请3个用户获20%运费折扣'
        },
        4: { 
          members: '103,085', 
          activities: '每月1个活动，参与人数约2000人',
          rewards: '等级抽奖，免运费+免费商品',
          referral: '前5名获不同价值现金或代金券'
        },
        5: { 
          members: '52,014', 
          activities: '被Discord封禁',
          rewards: '被Discord封禁',
          referral: '被Discord封禁'
        },
        6: { 
          members: '43,550', 
          activities: '每月1个活动，参与人数约1500人',
          rewards: '免运费+商品充值',
          referral: '前30名获免运费和3元/邀请'
        },
        7: { 
          members: '54,249', 
          activities: '每月1-2个活动，参与人数约600-700人',
          rewards: '优惠券+oopbuy硬币',
          referral: '邀请好友注册获30%运费折扣'
        },
        8: { 
          members: '47,743', 
          activities: '每月1-2个活动，参与人数约200人',
          rewards: '运费优惠券，商家礼赠',
          referral: '前5名获不同价值现金或代金券'
        },
        9: { 
          members: '396', 
          activities: '目前只举行了一次',
          rewards: '运费优惠券',
          referral: '无'
        }
      }
    },
    timing: {
      label: '时效',
      icon: Clock,
      data: {
        1: { 
          accept: '2小时', 
          purchase: '6小时', 
          shipping: '27小时',
          arrival: '3-4天',
          qc: '24小时'
        },
        2: { 
          accept: '数据缺失', 
          purchase: '数据缺失', 
          shipping: '数据缺失',
          arrival: '数据缺失',
          qc: '数据缺失'
        },
        3: { 
          accept: '0.5小时', 
          purchase: '6小时', 
          shipping: '24小时',
          arrival: '1-3天',
          qc: '24小时'
        },
        4: { 
          accept: '0.5小时', 
          purchase: '不愿透露', 
          shipping: '48小时',
          arrival: '2天',
          qc: '48小时'
        },
        5: { 
          accept: '0.5小时', 
          purchase: '北京时间8-18点6小时内，18-8点次日14点前', 
          shipping: '淘宝/1688卖家3-7天',
          arrival: '珠三角1-2天，长三角3-5天，偏远7天',
          qc: '24小时(工作日)'
        },
        6: { 
          accept: '12小时', 
          purchase: '6小时', 
          shipping: '淘宝和1688通常2-7天',
          arrival: '2天',
          qc: '24小时'
        },
        7: { 
          accept: '6小时', 
          purchase: '6小时', 
          shipping: '淘宝3-7天，京东自营当天',
          arrival: '珠三角1-2天，长三角3-5天，偏远7天',
          qc: '24小时'
        },
        8: { 
          accept: '0.5小时', 
          purchase: '不愿透露', 
          shipping: '24小时',
          arrival: '1-3天',
          qc: '24小时'
        },
        9: { 
          accept: '4.5小时', 
          purchase: '6小时', 
          shipping: '24小时',
          arrival: '3-5天',
          qc: '48小时'
        }
      }
    },
    coupon: {
      label: '优惠券',
      icon: Gift,
      data: {
        1: { 
          amount: '$150优惠券', 
          type: '运费折扣', 
          threshold: '无门槛',
          maxDiscount: '10.74%',
          stackable: '不可叠加'
        },
        2: { 
          amount: '$210优惠券', 
          type: '数据缺失', 
          threshold: '数据缺失',
          maxDiscount: '数据缺失',
          stackable: '数据缺失'
        },
        3: { 
          amount: '$210优惠券+30%运费折扣', 
          type: '运费折扣', 
          threshold: '有门槛',
          maxDiscount: '15%',
          stackable: '不可叠加'
        },
        4: { 
          amount: '$150优惠券', 
          type: '运费折扣', 
          threshold: '有门槛',
          maxDiscount: '12%',
          stackable: '不可叠加'
        },
        5: { 
          amount: '$200优惠券', 
          type: '运费折扣+商品折扣', 
          threshold: '无门槛',
          maxDiscount: '10%',
          stackable: '不可叠加'
        },
        6: { 
          amount: '$410优惠券', 
          type: '运费折扣券', 
          threshold: '无门槛',
          maxDiscount: '12%',
          stackable: '不可叠加'
        },
        7: { 
          amount: '$210优惠券+30%运费折扣', 
          type: '运费折扣券', 
          threshold: '无门槛',
          maxDiscount: '10%',
          stackable: '不可叠加'
        },
        8: { 
          amount: '$150优惠券', 
          type: '运费折扣券', 
          threshold: '无门槛',
          maxDiscount: '12%',
          stackable: '不可叠加'
        },
        9: { 
          amount: '$277优惠券', 
          type: '运费折扣', 
          threshold: '最低门槛50CNY',
          maxDiscount: '40%',
          stackable: '不可叠加'
        }
      }
    },
    language: {
      label: '语言与货币',
      icon: Globe,
      data: {
        1: { 
          languages: '10种：英语、法语、中文、西班牙语、意大利语、德语、葡萄牙语、瑞典语、波兰语、罗马尼亚语',
          currencies: '9种：人民币、英镑、美元、澳元、新西兰元、欧元、加元、瑞士法郎、波兰兹罗提'
        },
        2: { 
          languages: '10种：英语、西班牙语、波兰语、瑞典语、中文、法语、葡萄牙语、德语、意大利语、捷克语',
          currencies: '9种：人民币、加元、英镑、美元、澳元、新西兰元、欧元、波兰兹罗提、瑞士法郎'
        },
        3: { 
          languages: '8种：英语、西班牙语、德语、波兰语、葡萄牙语、意大利语、法语、阿拉伯语',
          currencies: '5种：美元、英镑、欧元、巴西雷亚尔、波兰兹罗提'
        },
        4: { 
          languages: '2种：中文、英文',
          currencies: '2种：人民币、美元'
        },
        5: { 
          languages: '7种：意大利语、德语、法语、西班牙语、英语、波兰语、中文(简体)',
          currencies: '11种：美元、欧元、澳元、墨西哥比索、韩元、英镑、新西兰元、加元、巴西雷亚尔、人民币、波兰兹罗提'
        },
        6: { 
          languages: '16种：简体中文、波兰语、西班牙语、阿拉伯语、中文、俄语、法语、瑞典语、英语、德语、韩语、葡萄牙语、荷兰语、意大利语、日语、罗马尼亚语',
          currencies: '11种：人民币、英镑、波兰兹罗提、澳元、新西兰元、美元、加元、欧元、新加坡元、瑞士法郎、捷克克朗'
        },
        7: { 
          languages: '9种：英语、捷克语、德语、日语、葡萄牙语、简体中文、法语、意大利语、波兰语、西班牙语',
          currencies: '16种：美元、加元、欧元、墨西哥比索、丹麦克朗、瑞典克朗、韩元、澳元、人民币、日元、新西兰元、波兰兹罗提、瑞士法郎、英镑、挪威克朗'
        },
        8: { 
          languages: '4种：英语、波兰语、西班牙文、中文(简体)',
          currencies: '4种：美元、波兰兹罗提、欧元、人民币'
        },
        9: { 
          languages: '2种：中文、英语',
          currencies: '15种：美元、英镑、欧元、新西兰元、澳元、加元、人民币、墨西哥比索、巴西雷亚尔、韩元、波兰兹罗提、捷克克朗、丹麦克朗、挪威克朗、瑞典克朗'
        }
      }
    },
    commission: {
      label: '联盟佣金',
      icon: Percent,
      data: {
        1: { base: '3%', max: '7%', mechanism: '邀请用户国际物流货运越多，奖励越多' },
        2: { base: '数据缺失', max: '数据缺失', mechanism: '数据缺失' },
        3: { base: '容易获取较高比例', max: '根据邀请用户数量', mechanism: '邀请用户总运费消费×对应百分比' },
        4: { base: '3.5%', max: '7.5%', mechanism: '关联用户完成包裹消费时获得奖金' },
        5: { base: '商品+运费', max: '商品折扣', mechanism: '商品消费及运费消费都计入佣金体系' },
        6: { base: '3.5%', max: '7.5%', mechanism: '邀请用户支付国际运费×对应佣金比例' },
        7: { base: '2%', max: '6%', mechanism: '首单5$+订单1%+运费2-6%' },
        8: { base: '3.5%', max: '7.5%', mechanism: '同Allchinabuy' },
        9: { base: '4%', max: '9%', mechanism: '累计用户支付运费金额×对应比例' }
      }
    },
    membership: {
      label: '会员体系',
      icon: Award,
      data: {
        1: { 
          points: '1CNY运费=1积分，100积分=1元',
          usage: '可兑换商品、增值服务、运费折扣等',
          special: '可通过余额购买积分'
        },
        2: { 
          points: '无会员体系',
          usage: '/',
          special: '/'
        },
        3: { 
          points: '无会员体系',
          usage: '/',
          special: '/'
        },
        4: { 
          points: '运费每消费1元积1分',
          usage: '100积分=1元，可抵扣运费',
          special: '积分可叠加使用，有效期1年'
        },
        5: { 
          points: '无会员体系',
          usage: '/',
          special: '/'
        },
        6: { 
          points: '无会员体系',
          usage: '/',
          special: '/'
        },
        7: { 
          points: '成长值=包裹实际支付运费',
          usage: '实际支付的国际运费',
          special: '未形成完整会员体系'
        },
        8: { 
          points: '无会员体系',
          usage: '/',
          special: '/'
        },
        9: { 
          points: '积分累计自身消费金额',
          usage: '增加联盟佣金比例',
          special: '仅有运费折扣'
        }
      }
    },
    transshipment: {
      label: '转运服务',
      icon: Globe,
      data: {
        1: { address: '无', requirements: '无' },
        2: { address: '广东省惠州市惠城区三栋镇', requirements: '目的国家、快递单号、包裹名字' },
        3: { address: '无', requirements: '无' },
        4: { address: '广东省惠州市', requirements: '快递公司、单号、商品链接、类别、数量、单价、备注' },
        5: { address: '福建省厦门市同安区五显镇', requirements: '快递单号、包裹名字' },
        6: { address: '厦门市翔安区民安街道', requirements: '快递单号、包裹名字' },
        7: { address: '福建省厦门市同安区埭头村', requirements: '快递单号、包裹名字' },
        8: { address: '广东省惠州市', requirements: '物流公司、单号、商品名称、数量、类别、单价、备注' },
        9: { address: '广东省河源市源城区埔前镇', requirements: '快递单号、备注' }
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
        1: { 
          systems: ['iOS', 'Android'],
          size: '88MB',
          languages: '10种语言，9种货币',
          features: '功能板块多，无乱码'
        },
        2: { 
          systems: ['iOS', 'Android'],
          size: '73MB',
          languages: '10种语言，10种货币',
          features: '基础功能'
        },
        3: { 
          systems: ['iOS'],
          size: '11.4MB',
          languages: '8种语言，5种货币',
          features: '功能不完善，仅苹果系统'
        },
        4: { 
          systems: ['iOS', 'Android'],
          size: '数据缺失',
          languages: '2种语言，2种货币',
          features: '语言和货币种类少'
        },
        5: { 
          systems: ['iOS', 'Android'],
          size: '108MB',
          languages: '8种语言，11种货币',
          features: '网页版没有APP二维码'
        },
        6: { 
          systems: ['无APP'],
          size: '/',
          languages: '/',
          features: '无APP'
        },
        7: { 
          systems: ['iOS', 'Android'],
          size: '数据缺失',
          languages: '9种语言，16种货币',
          features: '货币种类最多，版式舒服'
        },
        8: { 
          systems: ['iOS', 'Android'],
          size: '数据缺失',
          languages: '仅英语',
          features: '语言和货币种类少'
        },
        9: { 
          systems: ['iOS'],
          size: '82.6MB',
          languages: '2种语言',
          features: '内容简单，与电脑版相同'
        }
      }
    },
    valueAddedService: {
      label: '增值服务',
      icon: Plus,
      data: {
        1: { 
          free: '无',
          paid: '珍珠棉5元、折叠鞋盒3.5元、鞋撑10元、防撞角10元、抽真空20元、加固20元、拉伸膜15元',
          shipping: '无'
        },
        2: { 
          free: '无',
          paid: '折叠鞋盒3.5元、鞋撑10元、防撞角10元、抽真空20元、加固20元、拉伸膜15元',
          shipping: '无'
        },
        3: { 
          free: '无',
          paid: '拆除原包装1元',
          shipping: '无'
        },
        4: { 
          free: '去掉吊牌、去掉包装、极简包装',
          paid: 'EPE珍珠棉23元、防尘袋4元、珍珠棉包装4元、气泡袋3元、气泡柱5元、塑封10元、更改包装2元、拆分订单2元、商品视频20元、剪标3元',
          shipping: '优先出库10元、EPE泡沫填充3元/kg、纸护角5元/kg、拉伸膜4元/kg、木箱加固250元、防潮袋6元、个性化包装5元、真空压缩17元、折叠鞋盒5元'
        },
        5: { 
          free: '纸箱、简易包装、免费鞋撑',
          paid: '气泡膜4元/kg、防潮袋6元/kg、拉伸膜4元/kg、包装加固10元、角保护20元',
          shipping: '无'
        },
        6: { 
          free: '去标签、去外包装',
          paid: '鞋撑10元、气泡片5元、压缩袋15元、拉伸膜10元、防潮塑料袋5元、防撞护角10元',
          shipping: '无'
        },
        7: { 
          free: '纸箱包装、极简包装、移除鞋盒、拆除原包装(限时免费)',
          paid: '鞋撑5元、气泡膜5元、真空袋20元、防潮袋9元、拉伸膜4元/kg、包裹加固5元/kg、角保护8元',
          shipping: '无'
        },
        8: { 
          free: '纸箱包装、极简包装',
          paid: '金属鞋撑15元、真空袋15元、拉伸缠绕膜10元',
          shipping: '无'
        },
        9: { 
          free: '纸箱包装、极简包装',
          paid: '气泡片5元、压缩袋15元、防潮塑料袋5元、拉伸缠绕膜10元、防撞护角10元',
          shipping: '无'
        }
      }
    }
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
                                    
                                    {key === 'qc' && renderSimpleData(data, [
                                      { key: 'free', label: '免费QC' },
                                      { key: 'extra', label: '额外QC价格' },
                                      { key: 'quality', label: '照片质量' }
                                    ])}
                                    
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
