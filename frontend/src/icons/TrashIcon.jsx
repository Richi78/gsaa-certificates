const TrashIcon = ({ width = 16, height = 16, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={color}
  >
    <path d="M9 3a1 1 0 0 0 -1 1v1h8v-1a1 1 0 0 0 -1 -1h-6z" />
    <path d="M4 7h16v1a1 1 0 0 1 -1 1h-1v9a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-9h-1a1 1 0 0 1 -1 -1v-1zm6 4a1 1 0 0 0 -2 0v6a1 1 0 0 0 2 0v-6zm4 -1a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1z" />
  </svg>
)

export default TrashIcon