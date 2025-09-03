export const normalizeId = (str: string) => str
    .replace(
        /(?:^[a-z])|(?:-\w)/g,
        s => s.replace("-", "")
            .toUpperCase()
    )
