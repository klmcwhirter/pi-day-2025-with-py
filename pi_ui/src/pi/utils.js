
export const current_time = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()},${d.getMilliseconds()}`;
};

export const logJS = (msg, obj) => {
    const str = `JS: ${current_time()} ${msg}`;

    if (obj) {
        console.log(str, obj);
    } else {
        console.log(str);
    }
}
