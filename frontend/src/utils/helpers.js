export const getDateTime = (dateObject) => {
    const date = dateObject.toDateString().slice(4)
    const time = dateObject.toTimeString().slice(0,5)

    return date + ', at ' + time
}

export const snakeCase = string => (
    string.toLowerCase()
        .split(' ')
        .join('_')
)