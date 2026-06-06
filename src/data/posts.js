export const posts = [
    {
        id: 'example-post',
        title: '文章标题',
        date: '2026-06-06',
        category: '分类',
        tags: ['标签一', '标签二'],
        summary: '这里写文章摘要，用一两句话说明这篇文章主要记录了什么内容。',
        file: 'example-post',
        featured: true,
    },
]

export function getPostById(id) {
    return posts.find((post) => post.id === id)
}