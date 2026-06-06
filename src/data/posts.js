export const posts = [
    {
        id: '1',
        title: '何为四元数&Mahony空间四元数解算',
        date: '2026-06-06',
        category: '数学理论推导系列教程',
        tags: ['四元数', 'Mahony解算'],
        summary: '这是一篇用于测试 Markdown 与 KaTeX 公式渲染的文章。',
        file: '何为四元数&Mahony空间四元数解算',
        featured: true,
    },
]

export function getPostById(id) {
    return posts.find((post) => post.id === id)
}