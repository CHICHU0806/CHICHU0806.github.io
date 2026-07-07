export const posts = [
    {
        id: '0-2',
        title: '一个合理的工具链配置流程',
        date: '2026-07-07',
        latestOrder: 1,
        category: '',
        tags: ['工具链', '配置', '嵌入式'],
        summary: '本文介绍了一个合理的工具链配置流程，帮助嵌入式开发者快速搭建开发环境。',
        file: 'Star/一个合理的工具链配置流程',
        featured: true,
        featuredOrder: 1,
    },
    {
        id: '1-1',
        title: '大疆C板之初识CAN通信',
        date: '2026-07-03',
        latestOrder: 1,
        category: 'F407开发板系列教程',
        tags: ['大疆C板', 'CAN通信', 'STM32CubeMX'],
        summary: '本文介绍了大疆C板的CAN通信基础知识，包括时钟配置、CAN引脚配置、波特率设置以及代码层面的发送逻辑。',
        file: 'F407-Board/大疆C板之初识CAN通信',
        featured: false,
        featuredOrder: 0,
    },
    {
        id: '2-1',
        title: '达妙MC02之FDCAN初步配置方法',
        date: '2026-06-09',
        latestOrder: 1,
        category: 'H723开发板系列教程',
        tags: ['达妙MC02', 'FDCAN'],
        summary: '本文对达妙MC02开发板的FDCAN接口进行初步配置，介绍了相关的硬件连接和软件设置方法，帮助读者快速上手使用FDCAN进行通信。',
        file: 'H723-Board/达妙MC02之FDCAN初步配置方法',
        featured: false,
        featuredOrder: 0,
    },
    {
        id: '2-2',
        title: '达妙MC02之BSP_FDCAN库的重新构建',
        date: '2026-06-09',
        latestOrder: 2,
        category: 'H723开发板系列教程',
        tags: ['达妙MC02', 'FDCAN'],
        summary: '本文对达妙MC02开发板的BSP_FDCAN库进行重新构建，详细介绍了库的结构、功能以及如何进行定制化开发，以满足不同应用场景的需求。',
        file: 'H723-Board/达妙MC02之BSP_FDCAN库的重新构建',
        featured: false,
        featuredOrder: 0,
    },
    {
        id: '3-1',
        title: '何为四元数&Mahony空间四元数解算',
        date: '2026-06-06',
        latestOrder: 1,
        category: '数学理论推导系列教程',
        tags: ['四元数', 'Mahony解算'],
        summary: '本文对四元数的定义、性质以及在空间解算中的应用进行详细介绍，并通过Mahony解算方法展示其实际应用。',
        file: 'math-theory/何为四元数&Mahony空间四元数解算',
        featured: false,
        featuredOrder: 0,
    },
    {
        id: '3-2',
        title: '卡尔曼滤波（KF）的基础理论推导',
        date: '2026-06-07',
        latestOrder: 1,
        category: '数学理论推导系列教程',
        tags: ['卡尔曼滤波', 'KF'],
        summary: '本文对卡尔曼滤波从一阶向二阶在特定环境下进行了初步的推导，并且为后面向EKF的拓展埋下伏笔。',
        file: 'math-theory/卡尔曼滤波（KF）的基础理论推导',
        featured: false,
        featuredOrder: 0,
    },
]

export function getPostById(id) {
    return posts.find((post) => post.id === id)
}

export function getPostsByIds(ids) {
    return ids
        .map((id) => getPostById(id))
        .filter(Boolean)
}

export function getLatestPosts() {
    return [...posts].sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date)

        if (dateDiff !== 0) {
            return dateDiff
        }

        return (a.latestOrder ?? 999) - (b.latestOrder ?? 999)
    })
}

export function getFeaturedPosts() {
    return posts
        .filter((post) => post.featured)
        .sort((a, b) => {
            return (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999)
        })
}