export function prettifyName(name: string) {
    name = `${name[0].toUpperCase()}${name.slice(1)}`;
    name = name.trim();
    name = name.replace(/[A-Z]/g, char => ` ${char}`);

    return name;
}
