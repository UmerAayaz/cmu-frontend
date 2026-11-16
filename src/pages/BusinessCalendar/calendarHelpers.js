export const isoDay = (d) => (d.day() === 0 ? 7 : d.day());
export const shortTime = (time) => time.replace(/^0(\d)/, '$1');