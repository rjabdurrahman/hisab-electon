import React, { ReactNode } from "react";
import { ITableColumn } from "./ITable";
import { _get, clsx } from "../../helpers";

interface TableProps {
  miniColumns?: ITableColumn[];
  columns: ITableColumn[];
  data?: any[];
  children?: ReactNode;
  className?: string;
  onlyTable?: boolean;
  BlankElement?: React.ReactNode;
}

const BasicTable: React.FC<TableProps> = ({
  miniColumns = [],
  columns,
  data = [],
  children,
  onlyTable = false,
  className = "",
  BlankElement = (
    <div className="w-full text-center p-8 font-black  t mt-4 bg-[#F4F4F4] text-slate-400 rounded-sm border-2 border-dashed border-gray-200 text-[10px]">
      No records found
    </div>
  ),
}) => {
  const headerColums = columns.map((column) => {
    if (
      column.key === "actions" &&
      !column.headClass?.includes("print:hidden")
    ) {
      if (column.headClass)
        column.headClass = `${column.headClass} print:hidden`;
      else column.headClass = "print:hidden";
    }

    return (
      <th
        key={column.label + column.key}
        className={clsx(
          "text-left px-3 py-2.5 font-semibold text-white border-b border-divider bg-[#333333] sticky top-0 z-1 text-[12px]",
          column.headClass
        )}
      >
        {column.label}
      </th>
    );
  });

  const rows = data.map((row, idx) => (
    <tr key={idx} className="bg-white hover:bg-[#F4F4F4] transition-colors group">
      {columns.map((column) => {
        if (column.key === "actions") {
          if (column.rowClass)
            column.rowClass = `${column.rowClass} print:hidden`;
          else column.rowClass = "print:hidden";
        }
        return (
          <td key={column.label + column.key}
            className={clsx(
              "p-3 text-[#333333] border-b border-[#D1D5DB] text-[12px] font-medium transition-all group-hover:border-[#2563EB]/20",
              column.rowClass
            )}>
            {column.key === "sl"
              ? idx + 1
              : column.render
                ? column?.render(_get(row, column.key), row, idx)
                : _get(row, column.key)}
          </td>
        );
      })}
    </tr>
  ));

  const miniRows = data.map((row, idx) => (
    <tr key={idx} className="bg-white border-b border-gray-100 p-4 block md:hidden mb-2 rounded">
      {miniColumns?.map((column) => (
        <td key={column.label + column.key} className={clsx("block py-1", column.rowClass)}>
          <span className="font-bold text-[9px]  tracking-tighter text-gray-400 mr-2">{column.label}:</span>
          <span className="text-[12px] font-medium text-[#333333]">
            {column.key === "sl"
              ? idx + 1
              : column.render
                ? column?.render(_get(row, column.key), row, idx)
                : _get(row, column.key)}
          </span>
        </td>
      ))}
    </tr>
  ));

  const MainTable = (
    <>
      {!Boolean(rows.length) && BlankElement}
      {Boolean(rows.length) && (
        <table className={clsx("w-full border-collapse", miniColumns?.length ? "no-header" : "")}>
          <thead className={clsx("bg-[#333333]", miniColumns?.length ? "max-sm:hidden" : "")}>
            <tr>{headerColums}</tr>
          </thead>
          <tbody className={clsx(miniColumns?.length ? "max-sm:hidden" : "")}>
            {rows}
            {children}
          </tbody>
          {Boolean(miniColumns?.length) && (
            <tbody className="print:hidden md:hidden">
              {miniRows}
              {children}
            </tbody>
          )}
        </table>
      )}
    </>
  );

  if (onlyTable) return MainTable;

  return (
    <div
      className={clsx(
        "overflow-auto rounded bg-white",
        className
      )}
    >
      {MainTable}
    </div>
  );
};

export default BasicTable;
