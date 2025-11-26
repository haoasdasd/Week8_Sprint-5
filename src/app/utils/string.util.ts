// Member formatter
export const memberFormatter = (quantity: number | undefined) => {
    if (!quantity) return '0 member'
    if (quantity >= 1000000) {
        return (quantity / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    } else if (quantity >= 1000) {
        return (quantity / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    }
    return quantity.toString() + ' member'
}

// Date formatter
export function formatDate(isoDate: number): string {
    const date = new Date(isoDate * 1000)

    const day = ('0' + date.getDate()).slice(-2)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

export const isPhoneNumber = (str: string): boolean => {
    // Return false for empty strings
    if (!str) return false

    // Remove all non-digit characters except the plus sign
    const cleaned = str.replace(/[^0-9+]/g, '')

    // Check if the phone number starts with the country code
    const hasCountryCode = cleaned.startsWith('+84')

    // Remove country code if present
    const digits = hasCountryCode ? cleaned.substring(3) : cleaned

    // Vietnamese mobile numbers are 10 digits
    // If number started with 0, it should be 10 digits
    // If number didn't have leading 0 (when using with country code), it should be 9 digits
    if (hasCountryCode) {
        // With +84, valid numbers should have 9 digits (without the leading 0)
        if (digits.length !== 9) return false

        // Check valid prefixes (without the leading 0)
        const prefix = digits.substring(0, 2)
        const validPrefixes = [
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
            '39', // Viettel
            '81',
            '82',
            '83',
            '84',
            '85', // Vinaphone
            '70',
            '76',
            '77',
            '78',
            '79', // Mobifone
            '56',
            '58', // Vietnamobile
            '59'
        ] // Gmobile

        return validPrefixes.includes(prefix)
    } else {
        // Without country code, number should start with 0 and have 10 digits
        if (digits.length !== 10 || !digits.startsWith('0')) return false

        // Check valid prefixes
        const prefix = digits.substring(0, 3)
        const validPrefixes = [
            '032',
            '033',
            '034',
            '035',
            '036',
            '037',
            '038',
            '039', // Viettel
            '081',
            '082',
            '083',
            '084',
            '085', // Vinaphone
            '070',
            '076',
            '077',
            '078',
            '079', // Mobifone
            '056',
            '058', // Vietnamobile
            '059'
        ] // Gmobile

        return validPrefixes.includes(prefix)
    }
}

export function formatDateTimestamp(timestamp: number | undefined | null) {
    if (timestamp) {
        return new Date(timestamp * 1000)
    }
    return new Date()
}

export const formatImageBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const base64 = reader.result.split(',')[1]
                resolve(base64)
            } else {
                reject('Unexpected result type')
            }
        }
        reader.onerror = (error) => {
            console.error('Error converting file to Base64: ', error)
            reject(error)
        }
    })
}

export function formatHoursMinutes(date: Date) {
    const hours24 = date.getHours() // Lấy giờ 24h
    const minutes = date.getMinutes() // Lấy phút
    const period = hours24 >= 12 ? 'PM' : 'AM' // Quyết định AM hay PM
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12 // Chuyển đổi giờ 24h sang 12h, nếu giờ là 0 (nửa đêm), chuyển thành 12

    // Đảm bảo phút có 2 chữ số
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes

    // Trả về giờ với định dạng AM/PM
    return `${hours}:${formattedMinutes} ${period}`
}
const removeVietnameseAccents = (str: string) => {
    str = str.replace(/[Đ]/g, 'D')
    str = str.replace(/[đ]/g, 'd')
    return str.replace(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, (character) => {
        const accentsMap: { [key: string]: string } = {
            à: 'a',
            á: 'a',
            ả: 'a',
            ã: 'a',
            ạ: 'a',
            â: 'a',
            ầ: 'a',
            ấ: 'a',
            ẩ: 'a',
            ẫ: 'a',
            ậ: 'a',
            ă: 'a',
            ằ: 'a',
            ắ: 'a',
            ẳ: 'a',
            ẵ: 'a',
            ặ: 'a',
            è: 'e',
            é: 'e',
            ẻ: 'e',
            ẽ: 'e',
            ẹ: 'e',
            ê: 'e',
            ề: 'e',
            ế: 'e',
            ể: 'e',
            ễ: 'e',
            ệ: 'e',
            ì: 'i',
            í: 'i',
            ỉ: 'i',
            ĩ: 'i',
            ị: 'i',
            ò: 'o',
            ó: 'o',
            ỏ: 'o',
            õ: 'o',
            ọ: 'o',
            ô: 'o',
            ồ: 'o',
            ố: 'o',
            ổ: 'o',
            ỗ: 'o',
            ộ: 'o',
            ơ: 'o',
            ờ: 'o',
            ớ: 'o',
            ở: 'o',
            ỡ: 'o',
            ợ: 'o',
            ù: 'u',
            ú: 'u',
            ủ: 'u',
            ũ: 'u',
            ụ: 'u',
            ư: 'u',
            ừ: 'u',
            ứ: 'u',
            ử: 'u',
            ữ: 'u',
            ự: 'u',
            ỳ: 'y',
            ý: 'y',
            ỷ: 'y',
            ỹ: 'y',
            ỵ: 'y'
        }
        return accentsMap[character] || character
    })
}

export const removeVietnameseTones = (str: string) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    return str
}

// Remove special character -> generate name id
const removeSpecialCharacter = (str: string) =>
    // eslint-disable-next-line no-useless-escape
    str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
    const normalizedName = removeVietnameseAccents(name).toLowerCase().replace(/\s+/g, '-')
    return `${normalizedName}-i-${id}`
}

// Get id from name id
export const getIdFromNameId = (nameId: string) => {
    const arr = nameId?.split('-i-')
    return arr[arr.length - 1]
}

// Generate name id with collectives
export const generateNameIdWithCollectives = ({ name = '', id }: { name?: string; id: string }) => {
    if (!name) {
        return `c-${id}`
    }

    return removeSpecialCharacter(name.toLowerCase()).replace(/\s/g, '-') + `-c-${id}`
}

// Get id from name id with collectives
export const getIdFromNameIdWithCollectives = (nameId: string) => {
    const arr = nameId?.split('c-')
    return arr[arr.length - 1]
}

// Format date to string -> 1 Jan 2021
export const formatDateToString = (timestampInSeconds: number): string => {
    const date = new Date(timestampInSeconds * 1000)

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }

    let formattedDate = date.toLocaleDateString('en-GB', options)
    formattedDate = formattedDate.replace('Sept', 'Sep')

    return formattedDate
}

// Format date to relative string -> 1 day ago
export const formatDateToRelativeString = (timestampInSeconds: number): string => {
    const now = new Date()
    const date = new Date(timestampInSeconds * 1000)

    const secondsElapsed = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Convert to different time units
    const minute = 60
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day
    const month = 30 * day // Approximation
    const year = 365 * day // Approximation

    if (secondsElapsed < 10) {
        return 'Just now'
    } else if (secondsElapsed < minute) {
        return secondsElapsed === 1 ? '1 second ago' : `${secondsElapsed} seconds ago`
    } else if (secondsElapsed < hour) {
        const minutes = Math.floor(secondsElapsed / minute)
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
    } else if (secondsElapsed < day) {
        const hours = Math.floor(secondsElapsed / hour)
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`
    } else if (secondsElapsed < week) {
        const days = Math.floor(secondsElapsed / day)
        return days === 1 ? 'Yesterday' : `${days} days ago`
    } else if (secondsElapsed < month) {
        const weeks = Math.floor(secondsElapsed / week)
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    } else if (secondsElapsed < year) {
        const months = Math.floor(secondsElapsed / month)
        return months === 1 ? '1 month ago' : `${months} months ago`
    } else {
        const years = Math.floor(secondsElapsed / year)
        return years === 1 ? '1 year ago' : `${years} years ago`
    }
}

// Convert file to base64 string
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result
            if (typeof result === 'string') {
                resolve(result)
            } else {
                reject(new Error('Failed to convert file to base64'))
            }
        }
        reader.onerror = (error) => reject(error)
    })
}

// String > 12 character + ...
export const truncateText = (text: string) => {
    if (text.length > 16) {
        return text.slice(0, 12) + '...'
    }
    return text
}

// Generate strong password
export const generateStrongPassword = (length = 16) => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='
    const all = upper + lower + numbers + symbols

    let password = ''
    password += upper[Math.floor(Math.random() * upper.length)]
    password += lower[Math.floor(Math.random() * lower.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]

    for (let i = 4; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)]
    }

    return password
        .split('')
        .sort(() => 0.5 - Math.random()) // Shuffle
        .join('')
}
