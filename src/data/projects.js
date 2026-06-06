export const projects = [
    {
        id: 'example-project',
        title: '项目名称',
        date: '2026',
        category: '项目分类',
        tags: ['标签一', '标签二'],
        summary: '这里写项目简介，用几句话说明项目背景、目标和主要内容。',
        detail: `
      <p>这里是项目详情内容。</p>
      <p>你可以写项目背景、技术方案、实现过程、遇到的问题和最终结果。</p>
    `,
        featured: true,
    },
]

export function getProjectById(id) {
    return projects.find((project) => project.id === id)
}