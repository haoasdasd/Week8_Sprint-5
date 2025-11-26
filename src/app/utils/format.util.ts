/* eslint-disable @typescript-eslint/no-explicit-any */

export function parseData<T>(data: any | null | undefined, defaultValue: T): T {
    const dataString = data?.getData()
    try {
        return dataString ? (JSON.parse(dataString) as T) : defaultValue
    } catch (error) {
        console.error('Failed to parse data string:', error)
        return defaultValue
    }
}
export const formatNumberVN = (value: number | string): string => new Intl.NumberFormat('vi-VN').format(Number(value || 0))

export const unformatNumberVN = (value: string): number => Number(value.replace(/\./g, '').replace(/[^0-9]/g, ''))

// Nối tên firstName và lastName
export function joinName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`
}

// Nối tên firstName và lastName + (code)
export function joinNameWithCode(firstName: string, lastName: string, code: string) {
    return `${firstName} ${lastName} (${code})`
}

// Làm tròn và định dạng tiền
export function roundAndFormatCurrency(price: number, roundNumber: number = 0): string {
    // Làm tròn số đến số chữ số thập phân được chỉ định
    const factor = Math.pow(10, roundNumber)
    const rounded = Math.round(price * factor) / factor
    // Định dạng với dấu chấm phân cách hàng nghìn
    return rounded.toLocaleString('vi-VN', {
        minimumFractionDigits: roundNumber,
        maximumFractionDigits: roundNumber
    })
}

// Format date
export const formatDateVN = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
    const dayName = days[date.getDay()]
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${dayName}, ngày ${day}-${month}-${year}`
}
