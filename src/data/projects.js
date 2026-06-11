export const projects = [
    {
        id: '1',
        title: '基于Mahony+EKF的轻量化IMU姿态解算',
        date: '2026-06-10',
        category: '项目分类',
        tags: ['BMI088', 'Mahony','EKF'],
        summary: '基于C++面向对象重构，实现了7min内零漂0.3°，可以满足RoboMaster赛事需求。',
        detail: `
      <p>这里是项目详情内容。</p>
      <p>重庆大学千里战队26赛季</p>
    `,
        featured: true,
    },
]

export function getProjectById(id) {
    return projects.find((project) => project.id === id)
}