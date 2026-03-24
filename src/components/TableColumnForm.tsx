'use client';

type ColumnOption = {
  key: string;
  label: string;
};

type TableColumnFormProps = {
  options: ColumnOption[];
  selected: string[];
  onChange: (nextValue: string[]) => void;
};

const TableColumnForm = (props: TableColumnFormProps) => {
  const handleToggle = (key: string) => {
    if (props.selected.includes(key)) {
      if (props.selected.length === 1) {
        return;
      }

      props.onChange(props.selected.filter(item => item !== key));
      return;
    }

    props.onChange([...props.selected, key]);
  };

  return (
    <form className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-[#f9fbfd] p-4">
      <p className="text-sm font-semibold text-slate-700">Colunas visiveis</p>

      {props.options.map(option => (
        <label
          key={option.key}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
        >
          <input
            type="checkbox"
            checked={props.selected.includes(option.key)}
            onChange={() => handleToggle(option.key)}
            className="h-4 w-4 rounded border-slate-300 text-[#243142]"
          />
          {option.label}
        </label>
      ))}
    </form>
  );
};

export { TableColumnForm };
