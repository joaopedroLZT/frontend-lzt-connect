const statusClassNames: Record<string, string> = {
  ADMIN: 'bg-[#ffe0db] text-[#e1503f]',
  USER: 'bg-[#dff5ff] text-[#0f97ca]',
  MANAGER: 'bg-[#efe6ff] text-[#6f42c1]',
  SUPERVISOR: 'bg-[#fff0d9] text-[#d17a00]',
};

const fallbackClassNames = [
  'bg-[#e8f0ff] text-[#2463eb]',
  'bg-[#e8f8ee] text-[#227a4b]',
  'bg-[#fff3e0] text-[#b76a00]',
  'bg-[#f5e8ff] text-[#8b3dcb]',
];

const getFallbackClassName = (status: string) => {
  const characters = status.split('');
  const hash = characters.reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);

  return fallbackClassNames[hash % fallbackClassNames.length];
};

type StatusBadgeProps = {
  status: string;
  label: string;
};

const StatusBadge = (props: StatusBadgeProps) => (
  <span
    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
      statusClassNames[props.status] ?? getFallbackClassName(props.status)
    }`}
  >
    {props.label}
  </span>
);

export { StatusBadge };
