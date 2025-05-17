
export const current_time = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()},${d.getMilliseconds()}`;
};

export const logAS = (msg) => console.log(`AS: ${current_time()} ${msg}`);

export const logJS = (msg) => console.log(`JS: ${current_time()} ${msg}`);
