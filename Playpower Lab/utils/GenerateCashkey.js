const generateCacheKey = (username, filters) => {
    let key = `quizHistory:${username}`;

    // Object.keys(filters).forEach(filter => {
    //     if (filters[filter]) {
    //         key += `:${filter}=${filters[filter]}`;
    //     }
    // });
    for (var a in filters) {
        key += `:${a}=${filters[a]}`;
    }
    return key;
};

export default generateCacheKey;