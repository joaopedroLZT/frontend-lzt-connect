import { type ReactNode } from 'react';

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
};

const DataTable = <T,>(props: DataTableProps<T>) => {
  if (!props.rows.length) {
    return (
      <div className="rounded-b-[1.75rem] border-t border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
        {props.emptyMessage ?? 'Nenhum resultado encontrado.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-b-[1.75rem]">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-[#f4f7fb] text-left text-sm text-slate-500">
            {props.columns.map(column => (
              <th
                key={column.key}
                className={`border-b border-slate-200 px-4 py-4 font-semibold first:rounded-tl-2xl last:rounded-tr-2xl ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {props.rows.map(row => (
            <tr key={props.rowKey(row)} className="text-sm text-slate-700">
              {props.columns.map(column => (
                <td
                  key={column.key}
                  className={`border-b border-dashed border-slate-200 px-4 py-4 align-middle ${column.className ?? ''}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { DataTable };
export type { Column };
