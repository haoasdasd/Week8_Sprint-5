// Calculate the size of a file
export const getFileSizeInMB = (file: File | Blob): number => {
    const sizeInBytes = file.size
    const sizeInMB = sizeInBytes / (1024 * 1024)
    return parseFloat(sizeInMB.toFixed(2))
}

export const getImageHost = (url: string) => {
    return process.env.REACT_APP_API_URL + '/' + url
}
