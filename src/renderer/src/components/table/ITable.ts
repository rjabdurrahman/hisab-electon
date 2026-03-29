import React from 'react';

export interface ITableColumn {
    key: string;
    label: string;
    render?: (data: any, row: any, idx?: number | undefined) => React.ReactNode;
    align?: "left" | "center" | "right";
    headClass?: string;
    rowClass?: string;
}
