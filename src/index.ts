import { paperInstall, paperSearch } from "./Paper";

function main(): number {
    const args: string[] = process.argv.slice(2);

    if (args.length === 0) {
        console.error("Expected arguments.");
        return 1;
    }

    switch (args[0]) {
        case "install":
            paperInstall(args)
            break;

        case "search":
            paperSearch(args);
            break;
    
        default:
            console.error("Expected install/search");
            break;
    }

    return 0;
}

main();