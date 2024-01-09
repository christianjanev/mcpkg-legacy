import { api } from "./NetworkTools";
import { SHA256 } from "bun";

const endpoint: string = "https://api.papermc.io/v2";

interface Projects {
    projects: string[];
}

interface ProjectInfo {
    project_id: string,
    project_name: string,
    version_groups: string[],
    versions: string[];
}

interface VersionInfo {
    project_id: string,
    project_name: string,
    version: string,
    builds: number[];
}

interface Download {
    name: string,
    sha256: string
}

interface Downloads {
    application: Download,
    "mojang-mappings": Download
}

interface BuildInfo {
    project_id: string,
    project_name: string,
    version: string,
    build: number,
    time: string,
    channel: string,
    promoted: boolean,
    changes: Object[],
    downloads: Downloads
}

export async function getProjects(): Promise<String[]> {
    const response: Response = await api.get(`${endpoint}/projects`);
    return (await (response.json() as Promise<Projects>)).projects;
}

export async function getProjectInfo(project: String): Promise<ProjectInfo> {
    const response: Response = await api.get(`${endpoint}/projects/${project}`);
    return await response.json() as ProjectInfo;
}

export async function getVersionInfo(project: String, version: String): Promise<VersionInfo> {
    const response: Response = await api.get(`${endpoint}/projects/${project}/versions/${version}`)
    return await response.json() as VersionInfo;
}

export async function getBuildInfo(project: String, version: String, build: number): Promise<BuildInfo> {
    const response: Response = await api.get(`${endpoint}/projects/${project}/versions/${version}/builds/${build}`)
    return await response.json() as BuildInfo;
}

export async function downloadBuild(project: String, version: String, build: number, download: String): Promise<void> {
    const response: Response = await api.get(`${endpoint}/projects/${project}/versions/${version}/builds/${build}/downloads/${download}`);
    Bun.write(`./${download}`, response);
}

export async function paperSearch(args: string[]): Promise<void> {
    const searchArgs: string[] = args.slice(1);

    switch (searchArgs[0]) {
        case "paper": case "travertine": case "waterfall": case "velocity": case "folia":
            const info = await getProjectInfo(searchArgs[0]);

            if (searchArgs.length == 1) {
                
                info.versions.forEach(async version => {
                    if (version === info.versions[info.versions.length - 1]) console.info(`\x1b[32m${info.project_name}/${version} -- Latest\x1b[0m`)
                    else console.info(`${info.project_name}/${version}`)
                })

                // for (let i = 0; i < versions.length; i++) {
                //     const builds = (await getVersionInfo(info.project_id, versions[i])).builds
                //     console.info(`${info.project_name}/${versions[i]}\n\tLatest Build: ${builds[builds.length - 1]}`)
                // }
            }
            else if (searchArgs[1] === "latest") {
                const versionInfo = await getVersionInfo(info.project_id, info.versions[info.versions.length - 1]);

                console.log(`${info.project_name}/${versionInfo.version}\n\t${versionInfo.builds.join(', ')}`);
            }
            else if (info.versions.includes(searchArgs[1])) {
                const version = searchArgs[1];
                const versionInfo = await getVersionInfo(info.project_id, version);
                console.log(`${info.project_name}/${version}\n\t${versionInfo.builds.join(', ')}`);
            }
            else console.error("Version not found.");

            break;

        default:
            (await getProjects()).forEach(project => {
                console.log(project);
            })
            break;
    }
}

export async function paperInstall(args: string[]): Promise<void> {
    const installArgs = args.slice(1);

    switch (installArgs[0]) {
        case "paper": case "travertine": case "waterfall": case "velocity": case "folia":
            if (installArgs.length >= 3) {
                if ((await getProjectInfo(installArgs[0])).versions.includes(installArgs[1])) {
                    if ((await getVersionInfo(installArgs[0], installArgs[1])).builds.includes(Number(installArgs[2]))) {
                        await downloadBuild(installArgs[0], installArgs[1], Number(installArgs[2]), `${installArgs[0]}-${installArgs[1]}-${installArgs[2]}.jar`);
                    }
                }
            }
            else if (installArgs[1] === "latest") {

            }
            else console.error("Expected project, version, and build or project and \"latest\"");
            
            break;

        default:
            console.error("Project not found.");
            break;
    }
}