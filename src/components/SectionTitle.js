export function SectionTitle({ eyebrow, title, description = '' }) {
    return `
    <div class="section-title">
      <div>
        <p>${eyebrow}</p>
        <h2>${title}</h2>
      </div>

      ${
        description
            ? `<div class="section-desc">${description}</div>`
            : ''
    }
    </div>
  `
}