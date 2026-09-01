export type PaperSection = {
  title: string;
  page?: number;
};

export type Paper = {
  slug: string;
  order: string;
  type: 'pdf' | 'docx';
  file: string;
  cover?: string;
  pages: number;
  year: string;
  language: string;
  title: string;
  originalTitle: string;
  shortTitle: string;
  authors: string;
  venue: string;
  category: string;
  keywords: string[];
  abstract: string;
  methods: string[];
  findings: string[];
  sections: PaperSection[];
};

export const papers: Paper[] = [
  {
    slug: 'hybrid-pca-stacking',
    order: '01',
    type: 'pdf',
    file: '/documents/hybrid-pca-stacking.pdf',
    cover: '/covers/hybrid-pca-stacking.jpg',
    pages: 9,
    year: '2020',
    language: '英文',
    title: '中国现代化进程的多维评估：混合 PCA–Stacking 框架',
    originalTitle: "A Hybrid PCA-Stacking Framework for Multidimensional Assessment of Development Trajectories: Evidence from China's Modernization Process",
    shortTitle: '现代化进程多维评估',
    authors: 'Hanrui Wang · Yile Wang',
    venue: 'Frontiers in Economics and Management, 1(1)',
    category: '发展测度 / 机器学习',
    keywords: ['主成分分析', '中国发展指数', 'NAR 神经网络', 'Stacking', '可持续发展'],
    abstract: '论文构建中国发展指数（CDI），将经济、社会与治理维度纳入同一评价框架。研究先以 PCA 从 14 项指标中提炼两项主成分，再通过 NAR 神经网络与 Stacking 集成模型预测指标，最后结合熵权—变异系数方法合成长期发展指数并识别现代化阶段。',
    methods: ['PCA 主成分降维', 'NAR 时间序列神经网络', 'Stacking 回归与分类', '熵权—变异系数组合赋权'],
    findings: ['两项主成分解释 94.39% 的系统方差。', 'Stacking 相比单一模型降低预测误差，并用于识别发展阶段。', 'CDI 显示 2000 年后发展加速，长期趋势指向环境脱钩与可持续转型。'],
    sections: [
      { title: '引言', page: 1 },
      { title: '文献综述', page: 2 },
      { title: '现代化核心因子提取', page: 4 },
      { title: '中国发展指数构建', page: 5 },
      { title: '发展阶段识别', page: 7 },
      { title: '结论', page: 8 },
    ],
  },
  {
    slug: 'ipo-pricing-dml',
    order: '02',
    type: 'docx',
    file: '/documents/ipo-pricing-dml.docx',
    pages: 10,
    year: '2025',
    language: '英文',
    title: '基于双重机器学习的投资者情绪对 IPO 定价效率影响研究',
    originalTitle: 'Research on the Impact of Investor Sentiment on IPO Pricing Efficiency Based on Double Machine Learning',
    shortTitle: '投资者情绪与 IPO 定价',
    authors: 'Jintai Ye · Yunshi Chen · Yile Wang',
    venue: '工作论文',
    category: '金融市场 / 因果机器学习',
    keywords: ['双重机器学习', '广义随机森林', 'IPO 抑价', '投资者情绪', '异质性'],
    abstract: '基于 2019—2023 年 A 股 IPO 样本，论文从行为金融与信息经济学出发，使用双重机器学习和广义随机森林识别投资者情绪对 IPO 抑价的因果影响，并进一步分析发行规模、首日涨跌幅限制及企业特征带来的调节效应与非线性异质性。',
    methods: ['双重机器学习（DML）', '广义随机森林（GRF）', 'PCA 情绪指数', '稳健性与敏感性检验'],
    findings: ['投资者情绪显著推高 IPO 抑价，结论在多项检验下保持稳健。', '发行规模通过流动性稀释和投资者结构优化削弱情绪效应。', '发行市盈率呈倒 U 型异质性，低盈利或亏损企业对情绪更敏感。'],
    sections: [
      { title: '引言' },
      { title: '文献综述' },
      { title: '理论分析与研究假设' },
      { title: '研究设计与变量设定' },
      { title: '实证结果与异质性分析' },
      { title: '结论与政策含义' },
    ],
  },
  {
    slug: 'reciprocal-tariffs-apmcm',
    order: '03',
    type: 'pdf',
    file: '/documents/reciprocal-tariffs-apmcm.pdf',
    cover: '/covers/reciprocal-tariffs-apmcm.jpg',
    pages: 30,
    year: '2025',
    language: '英文',
    title: '2025 年美国“对等关税”政策的多层量化评估',
    originalTitle: 'A Multi-Layer Quantitative Assessment of the 2025 U.S. “Reciprocal Tariffs” Policy',
    shortTitle: '“对等关税”政策量化评估',
    authors: 'Team apmcm25305147',
    venue: '2025 APMCM · Problem C',
    category: '国际贸易 / 数学建模',
    keywords: ['Armington 模型', '结构引力模型', '嵌套 Logit', '网络流', '动态投入产出'],
    abstract: '围绕美国“对等关税”政策，论文从大豆、汽车、半导体、关税收入和制造业回流五个层面构建联动的量化评估体系，模拟关税冲击、贸易转移、产能调整、财政收益及宏观传导路径。',
    methods: ['Armington 需求与供给响应', '结构引力与嵌套 Logit', '半导体供应链网络流', '动态 Laffer 与投入产出模型'],
    findings: ['对美大豆加税会显著压缩其对华份额，巴西和阿根廷通过扩产与价格调整填补缺口。', '汽车与半导体产能可向美国及盟友转移，但伴随更高价格、财政成本和供应链集中风险。', '关税收入短期增加、长期受贸易收缩与报复措施侵蚀；制造业回流幅度有限且难以持续。'],
    sections: [
      { title: '问题重述与分析', page: 4 },
      { title: '假设与符号说明', page: 6 },
      { title: '问题一：大豆贸易', page: 7 },
      { title: '问题二：汽车产业', page: 12 },
      { title: '问题三：半导体供应链', page: 18 },
      { title: '问题四：关税收入', page: 21 },
      { title: '问题五：制造业回流', page: 24 },
      { title: '模型评价与结论', page: 28 },
    ],
  },
  {
    slug: 'digital-economy-carbon-emissions',
    order: '04',
    type: 'pdf',
    file: '/documents/digital-economy-carbon-emissions.pdf',
    cover: '/covers/digital-economy-carbon-emissions.jpg',
    pages: 28,
    year: '2026',
    language: '英文',
    title: '中国数字经济与碳排放耦合协调的时空格局',
    originalTitle: 'Mapping the Coupling Coordination Between China’s Digital Economy and Carbon Emissions: Spatiotemporal Patterns and Spatial Markov Transitions',
    shortTitle: '数字经济与碳排放耦合协调',
    authors: 'Chen Gao · Chujia Zhang · Zhenlin Chen · Yile Wang',
    venue: 'Sustainability 18(3), 1283',
    category: '数字经济 / 碳排放',
    keywords: ['耦合协调度', '数字经济指数', '碳排放指数', '空间马尔可夫', '时空演化'],
    abstract: '研究构建数字经济发展指数（DEI）和碳排放指数（CEI），考察 2011—2022 年两者协调发展的时空演变、空间异质性与跨区域状态转移，并结合核密度估计刻画耦合协调度的动态分布。',
    methods: ['耦合协调度模型', '全局与局部 Moran’s I', '空间马尔可夫链', '核密度估计'],
    findings: ['东部地区长期保持较高耦合协调水平，中西部仍有明显改善空间。', '邻域状态会改变地区向高协调水平转移的概率，空间溢出不可忽略。', '区域差异要求数字基础设施、能源结构与减排政策进行差异化协同。'],
    sections: [
      { title: '引言', page: 2 },
      { title: '数据与方法', page: 4 },
      { title: '实证结果', page: 11 },
      { title: '讨论', page: 22 },
      { title: '结论', page: 25 },
      { title: '参考文献', page: 26 },
    ],
  },
  {
    slug: 'digital-economy-gtfp',
    order: '05',
    type: 'docx',
    file: '/documents/digital-economy-gtfp.docx',
    pages: 26,
    year: '2025',
    language: '中文',
    title: '数字经济对区域绿色全要素生产率影响的实证分析',
    originalTitle: '数字经济对区域绿色全要素生产率影响的实证分析——基于中国省际面板数据的视角',
    shortTitle: '数字经济与绿色全要素生产率',
    authors: '作者见原文',
    venue: '学位论文 / 研究论文',
    category: '数字经济 / 绿色生产率',
    keywords: ['数字经济', '绿色全要素生产率', '空间效应', '系统 GMM', '门槛检验'],
    abstract: '基于 2014—2022 年中国 30 个省级地区的面板数据，论文以熵值法测算数字经济发展水平，以 SBM–DEA 和 GML 生产率指数衡量绿色全要素生产率，综合考察基准效应、动态效应、空间溢出与科技创新门槛。',
    methods: ['熵值法综合评价', 'Super SBM–DEA 与 GML 指数', '系统 GMM 与空间杜宾模型', '门槛效应模型'],
    findings: ['数字经济显著提升区域绿色发展水平，处理内生性后结论仍稳健。', '促进效应在东部地区更明显，中西部作用尚不显著。', '绿色发展存在动态继承与正向空间溢出，科技创新水平会强化数字经济的绿色效应。'],
    sections: [
      { title: '引言' },
      { title: '文献综述' },
      { title: '研究设计与指标测度' },
      { title: '基准回归与稳健性' },
      { title: '动态、空间与门槛效应' },
      { title: '结论与建议' },
    ],
  },
  {
    slug: 'regional-resilience',
    order: '06',
    type: 'docx',
    file: '/documents/regional-resilience.docx',
    pages: 14,
    year: '2026',
    language: '中文',
    title: '中国区域韧性时空演变及影响因素',
    originalTitle: '中国区域韧性时空演变及影响因素：基于省级面板数据的 Spearman–CRITIC 与 XGBoost–CatBoost–SHAP 实证研究',
    shortTitle: '中国区域韧性时空演变',
    authors: 'Yile Wang',
    venue: '工作论文',
    category: '区域经济 / 可解释机器学习',
    keywords: ['区域韧性', '时空演变', 'Spearman–CRITIC', 'XGBoost–CatBoost', 'SHAP'],
    abstract: '基于 2007—2024 年中国省级面板数据，研究从经济、社会、生态和基础设施四个维度构建区域韧性评价体系，使用 Spearman–CRITIC 测算综合指数，并借助空间统计和可解释机器学习识别韧性格局及关键影响因素。',
    methods: ['Spearman–CRITIC 赋权', '冷热点与核密度分析', 'XGBoost–CatBoost 融合', 'SHAP 可解释分析'],
    findings: ['全国省级韧性总体上升，但区域差异依然明显。', '热点主要分布在东部沿海及部分中东部省份，西部和西南部间歇性出现冷点。', '收入水平、民营经济活力和城市化率的解释贡献较高，并具有区域异质性。'],
    sections: [
      { title: '引言' },
      { title: '数据来源与测度体系' },
      { title: 'Spearman–CRITIC 方法' },
      { title: '时空演变与区域差异' },
      { title: 'XGBoost–CatBoost–SHAP 解释' },
      { title: '稳健性与结论' },
    ],
  },
];
