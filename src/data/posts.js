export const posts = [
    {
        id: '3-1',
        title: '何为四元数&Mahony空间四元数解算',
        date: '2026-06-06',
        category: '数学理论推导系列教程',
        tags: ['四元数', 'Mahony解算'],
        summary: '本文对四元数的定义、性质以及在空间解算中的应用进行详细介绍，并通过Mahony解算方法展示其实际应用。',
        file: '何为四元数&Mahony空间四元数解算',
        featured: true,
    },
    {
        id: '3-2',
        title: '卡尔曼滤波（KF）的基础理论推导',
        date: '2026-06-07',
        category: '数学理论推导系列教程',
        tags: ['卡尔曼滤波', 'KF'],
        summary: '本文对卡尔曼滤波从一阶向二阶在特定环境下进行了初步的推导，并且为后面向EKF的拓展埋下伏笔。',
        file: '卡尔曼滤波（KF）的基础理论推导',
        featured: true,
    },
    {
        id: '3-2',
        title: '卡尔曼滤波（KF）的基础理论推导',
        date: '2026-06-07',
        category: '数学理论推导系列教程',
        tags: ['卡尔曼滤波', 'KF'],
        summary: '本文对卡尔曼滤波从一阶向二阶在特定环境下进行了初步的推导，并且为后面向EKF的拓展埋下伏笔。',
        file: '卡尔曼滤波（KF）的基础理论推导',
        featured: true,
    },
    {
        id: '3-2',
        title: '卡尔曼滤波（KF）的基础理论推导',
        date: '2026-06-07',
        category: '数学理论推导系列教程',
        tags: ['卡尔曼滤波', 'KF'],
        summary: '本文对卡尔曼滤波从一阶向二阶在特定环境下进行了初步的推导，并且为后面向EKF的拓展埋下伏笔。',
        file: '卡尔曼滤波（KF）的基础理论推导',
        featured: true,
    },
    {
        id: '3-2',
        title: '卡尔曼滤波（KF）的基础理论推导',
        date: '2026-06-07',
        category: '数学理论推导系列教程',
        tags: ['卡尔曼滤波', 'KF'],
        summary: '本文对卡尔曼滤波从一阶向二阶在特定环境下进行了初步的推导，并且为后面向EKF的拓展埋下伏笔。',
        file: '卡尔曼滤波（KF）的基础理论推导',
        featured: true,
    },
]

export function getPostById(id) {
    return posts.find((post) => post.id === id)
}