import clsx from "clsx";
import { Fragment, ReactElement, ReactNode } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface Column<T = any> {
  key: string;
  header: ReactNode;
  className?: string;
  hidden?: boolean;
  cell(row: T): ReactNode;
}

export function CollapsibleRow({
  collapsed,
  colSpan,
  children,
  maxHeight,
}: {
  collapsed: boolean;
  colSpan: number;
  maxHeight: number;
  children: ReactElement;
}) {
  return (
    <TableRow className={collapsed ? "!border-none" : ""}>
      <TableCell colSpan={colSpan} className="p-0">
        <div
          className={clsx(
            "relative overflow-hidden transition-all",
            !collapsed && "min-h-[100px]"
          )}
          style={{
            maxHeight: collapsed ? "0" : `${maxHeight}px`,
          }}
        >
          {children}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  className,
  tableClassName = "",
  tableHeaderClassName,
  renderRow,
  renderRowExtra,
  customEmptyPage,
}: {
  data?: T[];
  columns: Column<T>[];
  className?: string;
  tableClassName?: string;
  tableHeaderClassName?: string;
  renderRow?(row: T, children: ReactNode): ReactNode;
  renderRowExtra?(row: T): ReactNode;
  customEmptyPage?: ReactNode;
}) {
  return (
    <div className={clsx("scrollbar-mini w-full overflow-auto", className)}>
      {Array.isArray(data) && data.length > 0 ? (
        <table className={clsx("w-full", tableClassName)}>
          <TableHeader>
            <TableRow className="text-xs text-slate-500">
              {columns
                .filter((col) => !col.hidden)
                .map((col) => (
                  <TableHead
                    key={col.key}
                    className={clsx(tableHeaderClassName, col.className)}
                  >
                    {col.header}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const rowContent = columns
                .filter((col) => !col.hidden)
                .map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell(item)}
                  </TableCell>
                ));
              return (
                <Fragment key={item.id}>
                  {renderRow ? (
                    renderRow(item, rowContent)
                  ) : (
                    <TableRow>{rowContent}</TableRow>
                  )}
                  {renderRowExtra && renderRowExtra(item)}
                </Fragment>
              );
            })}
          </TableBody>
        </table>
      ) : (
        customEmptyPage
      )}
    </div>
  );
}
