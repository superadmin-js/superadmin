export function prettifyName(name: string) {
    const separatorIndex = name.lastIndexOf(':');
    if (separatorIndex !== -1) {
        name = name.slice(separatorIndex + 1);
    }

    name = name.trim();
    // Add spaces before uppercase letters
    name = name.replace(/[A-Z]/g, char => ` ${char}`);
    name = name.toLowerCase();
    // Uppercase first letter
    name = `${name[0].toUpperCase()}${name.slice(1)}`;

    return name;
}
