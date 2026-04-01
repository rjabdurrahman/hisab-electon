import moment from "moment";

// Simple clsx-like helper for dynamic class names
export const clsx = (...classes: (string | undefined | boolean | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const _get = <T>(obj: Record<string, any>, path: string, defaultValue?: T): T | undefined => {
    if (!path) return obj as any;
    const keys = path.split('.');
    let result: any = obj;

    for (const key of keys) {
        if (result && Object.prototype.hasOwnProperty.call(result, key)) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }

    return (result === undefined ? defaultValue : result) as T;
}

export function objectIdToTimestamp(objectId: string) {
    if (!objectId) return 0;
    return parseInt(objectId.substring(0, 8), 16);
}

export function _pad(value: number | string, pad = '0') {
    if (!value) return "";
    return value.toString().padStart(4, pad);
}

export function noUnicode(e: any) {
    const map: any = {
        "০": "0",
        "১": "1",
        "২": "2",
        "৩": "3",
        "৪": "4",
        "৫": "5",
        "৬": "6",
        "৭": "7",
        "৮": "8",
        "৯": "9",
    };
    e.target.value = e.target.value.replace(/[০-৯]/g, (d: any) => map[d]);
}

export function disableEnterPress(e: any) {
    if (e.key === "Enter") {
        e.preventDefault();
    }
}

export function numFormatter(value: number | string | undefined, round = false) {
    if (value === 0) return 0;
    else if (!value || isNaN(Number(value))) {
        return "";
    }
    if (round) {
        return Math.round(Number(value)).toLocaleString("en-IN");
    }
    return Number(value).toLocaleString("en-IN");
}

export function shortNumFormatter(amount: number): string {
    if (Math.abs(amount) >= 1000) {
        const formatted = (amount / 1000).toFixed(2);
        return formatted.endsWith("0") ? `${parseFloat(formatted)}K` : `${formatted}K+`;
    }
    return amount.toString();
};

export function dateFormatter(dateStr: any, onlyDate: boolean = true): string {
    if (!dateStr) return "";
    if (onlyDate) return moment(dateStr.slice(0, 10)).format("DD MMM YYYY");
    else return moment(dateStr).format("DD MMM YYYY hh:mm")
}

export function objToFormData(obj: Record<string, any>, formData: FormData = new FormData(), parentKey?: string) {
    if (obj && typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof File)) {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (value instanceof File) {
                formData.append(formKey, value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    objToFormData({ [`${index}`]: item }, formData, formKey);
                });
            } else if (typeof value === 'object' && value !== null) {
                objToFormData(value, formData, formKey);
            } else {
                formData.append(formKey, value);
            }
        });
    } else {
        if (parentKey) {
            formData.append(parentKey, obj as any);
        }
    }

    return formData;
}

export function getTotalByDiscount(total: number, percent: number | undefined) {
    if (!percent) return total;
    else {
        const discountAmount = Math.floor((total * percent) / 100);
        return total - discountAmount;
    }
}

export function queryBuilder(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
};

export function numberToWords(numStr: number | string): string {
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    
    let num = parseInt(numStr.toString(), 10);
    if(isNaN(num)) return '';
    if (num === 0) return 'zero';
    if ((num = num.toString().length > 9 ? 0 : num) === 0) return 'overflow';

    const n = ('000000000' + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    
    let str = '';
    str += (n[1] !== '00') ? (a[Number(n[1])] || b[parseInt(n[1][0], 10)] + ' ' + a[parseInt(n[1][1], 10)]) + 'Crore ' : '';
    str += (n[2] !== '00') ? (a[Number(n[2])] || b[parseInt(n[2][0], 10)] + ' ' + a[parseInt(n[2][1], 10)]) + 'Lakh ' : '';
    str += (n[3] !== '00') ? (a[Number(n[3])] || b[parseInt(n[3][0], 10)] + ' ' + a[parseInt(n[3][1], 10)]) + 'Thousand ' : '';
    str += (n[4] !== '0') ? (a[Number(n[4])] || b[parseInt(n[4][0], 10)] + ' ' + a[parseInt(n[4][1], 10)]) + 'Hundred ' : '';
    str += (n[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[parseInt(n[5][0], 10)] + ' ' + a[parseInt(n[5][1], 10)]) : '';
    
    return str.trim();
}
