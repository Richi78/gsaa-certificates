const DuplicateIcon = ({ width = 16, height = 16, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={color}
  >
    <path d="M8 7a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8z" />
    <path d="M6 15h-1a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1h-2v-1h-8v8h1v2z" />
  </svg>
)

export default DuplicateIcon